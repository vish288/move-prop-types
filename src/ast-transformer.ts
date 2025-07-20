/**
 * AST-based PropTypes transformation using Babel
 * 
 * This module provides a more robust and accurate transformation compared to regex-based approach.
 * Benefits:
 * - Understands JavaScript/TypeScript syntax correctly
 * - Handles complex cases and edge cases better
 * - Preserves code formatting and comments where possible
 * - More maintainable and less error-prone
 */

import { parse } from '@babel/parser';
import * as traverseModule from '@babel/traverse';
import * as generateModule from '@babel/generator';
import type { NodePath } from '@babel/traverse';

// Handle both CommonJS and ES module imports for Babel packages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const traverseFn = (traverseModule as any).default || traverseModule;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateFn = (generateModule as any).default || generateModule;
import * as t from '@babel/types';

interface TransformationResult {
  code: string;
  modified: boolean;
}

interface PropTypesUsage {
  hasES6Import: boolean;
  hasReactPropTypesUsage: boolean;
  needsTransformation: boolean;
}

/**
 * Parse JavaScript/TypeScript file using Babel
 */
function parseCode(code: string, filename: string): t.File {
  const isTypeScript = filename.endsWith('.tsx') || filename.endsWith('.ts');
  
  return parse(code, {
    sourceType: 'module',
    allowImportExportEverywhere: false,
    allowReturnOutsideFunction: false,
    plugins: [
      'jsx',
      'asyncGenerators',
      'bigInt',
      'classProperties',
      'decorators-legacy',
      'doExpressions',
      'dynamicImport',
      'exportDefaultFrom',
      'exportNamespaceFrom',
      'functionBind',
      'functionSent',
      'importMeta',
      'nullishCoalescingOperator',
      'numericSeparator',
      'objectRestSpread',
      'optionalCatchBinding',
      'optionalChaining',
      'throwExpressions',
      'topLevelAwait',
      // 'trailingFunctionCommas',
      ...(isTypeScript ? ['typescript' as const] : [])
    ]
  });
}

/**
 * Analyze the code to determine PropTypes usage patterns
 */
function analyzePropTypesUsage(ast: t.File): PropTypesUsage {
  let hasES6Import = false;
  let hasReactPropTypesUsage = false;

  traverseFn(ast, {
    // Check for ES6 imports: import { PropTypes } from 'react'
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      if (
        (path.node.source.value === 'react' || path.node.source.value === 'React') &&
        path.node.specifiers.some((spec: t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier) => 
          t.isImportSpecifier(spec) && 
          (t.isIdentifier(spec.imported) ? spec.imported.name : spec.imported.value) === 'PropTypes'
        )
      ) {
        hasES6Import = true;
      }
    },

    // Check for React.PropTypes usage
    MemberExpression(path: NodePath<t.MemberExpression>) {
      if (
        t.isMemberExpression(path.node) &&
        t.isIdentifier(path.node.object, { name: 'React' }) &&
        t.isIdentifier(path.node.property, { name: 'PropTypes' })
      ) {
        hasReactPropTypesUsage = true;
      }
    }
  });

  return {
    hasES6Import,
    hasReactPropTypesUsage,
    needsTransformation: hasES6Import || hasReactPropTypesUsage
  };
}

/**
 * Transform ES6 PropTypes imports
 * Removes PropTypes from React import and adds separate PropTypes import
 */
function transformES6Imports(ast: t.File): boolean {
  let modified = false;
  let hasAddedPropTypesImport = false;

  traverseFn(ast, {
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      // Handle React imports that include PropTypes
      if (path.node.source.value === 'react' || path.node.source.value === 'React') {
        const propTypesSpecifier = path.node.specifiers.find((spec: t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier) => 
          t.isImportSpecifier(spec) && 
          (t.isIdentifier(spec.imported) ? spec.imported.name : spec.imported.value) === 'PropTypes'
        );

        if (propTypesSpecifier) {
          // Remove PropTypes from the React import
          path.node.specifiers = path.node.specifiers.filter((spec: t.ImportSpecifier | t.ImportDefaultSpecifier | t.ImportNamespaceSpecifier) => spec !== propTypesSpecifier);
          modified = true;

          // Add PropTypes import after the React import if not already added
          if (!hasAddedPropTypesImport) {
            const propTypesImport = t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier('PropTypes'))],
              t.stringLiteral('prop-types')
            );

            path.insertAfter(propTypesImport);
            hasAddedPropTypesImport = true;
          }

          // If React import becomes empty (only had PropTypes), remove it
          if (path.node.specifiers.length === 0) {
            path.remove();
          }
        }
      }
    }
  });

  return modified;
}

/**
 * Transform React.PropTypes usage to PropTypes
 */
function transformReactPropTypesUsage(ast: t.File): boolean {
  let modified = false;

  traverseFn(ast, {
    MemberExpression(path: NodePath<t.MemberExpression>) {
      // Transform React.PropTypes.* to PropTypes.*
      if (
        t.isMemberExpression(path.node) &&
        t.isIdentifier(path.node.object, { name: 'React' }) &&
        t.isIdentifier(path.node.property, { name: 'PropTypes' })
      ) {
        // Check if this is part of a longer chain like React.PropTypes.string
        const {parent} = path;
        if (t.isMemberExpression(parent) && parent.object === path.node) {
          // Replace React.PropTypes with just PropTypes
          path.replaceWith(t.identifier('PropTypes'));
          modified = true;
        }
      }
    }
  });

  return modified;
}

/**
 * Add PropTypes import at the top of the file if needed
 */
function addPropTypesImportIfNeeded(ast: t.File, hasReactPropTypesUsage: boolean): boolean {
  if (!hasReactPropTypesUsage) {
    return false;
  }

  // Check if PropTypes import already exists
  let hasExistingImport = false;
  traverseFn(ast, {
    ImportDeclaration(path: NodePath<t.ImportDeclaration>) {
      if (path.node.source.value === 'prop-types') {
        hasExistingImport = true;
      }
    }
  });

  if (hasExistingImport) {
    return false;
  }

  // Find the best place to insert the import (after React import or at the top)
  const {program} = ast;
  let insertIndex = 0;

  // Look for React import to insert after it
  for (let i = 0; i < program.body.length; i++) {
    const node = program.body[i];
    if (
      t.isImportDeclaration(node) &&
      (node.source.value === 'react' || node.source.value === 'React')
    ) {
      insertIndex = i + 1;
      break;
    }
  }

  // Create PropTypes import
  const propTypesImport = t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier('PropTypes'))],
    t.stringLiteral('prop-types')
  );

  // Insert the import
  program.body.splice(insertIndex, 0, propTypesImport);
  return true;
}

/**
 * Main transformation function using AST
 */
export function transformWithAST(
  code: string, 
  filename: string = 'unknown.js'
): TransformationResult {
  try {
    // Parse the code into AST
    const ast = parseCode(code, filename);

    // Analyze PropTypes usage
    const usage = analyzePropTypesUsage(ast);

    // If no PropTypes usage found, return original code
    if (!usage.needsTransformation) {
      return { code, modified: false };
    }

    let modified = false;

    // Transform ES6 imports
    if (usage.hasES6Import) {
      modified = transformES6Imports(ast) || modified;
    }

    // Transform React.PropTypes usage
    if (usage.hasReactPropTypesUsage) {
      modified = transformReactPropTypesUsage(ast) || modified;
      modified = addPropTypesImportIfNeeded(ast, true) || modified;
    }

    // Generate the transformed code
    const result = generateFn(ast, {
      retainLines: false,
      compact: false,
      concise: false,
      jsescOption: {
        quotes: 'single'
      }
    });

    return {
      code: result.code,
      modified
    };

  } catch (error) {
    // If AST parsing fails, return original code
    console.warn(`AST transformation failed for ${filename}:`, error instanceof Error ? error.message : String(error));
    return { code, modified: false };
  }
}

/**
 * Check if file needs PropTypes transformation using AST analysis
 */
export function needsTransformation(code: string, filename: string = 'unknown.js'): boolean {
  try {
    const ast = parseCode(code, filename);
    const usage = analyzePropTypesUsage(ast);
    return usage.needsTransformation;
  } catch {
    // If parsing fails, fall back to conservative approach
    return false;
  }
}