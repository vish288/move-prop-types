/**
 * Module dependencies
 */
import chalk from 'chalk';
import { stdout } from 'process';
import { lstatSync, readdir, readFile, writeFile } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

import { fileEncoding, importState } from './constants.js';

import type {
  FindMatchFunction,
  InstallPackageFunction,
  UpdateFileFunction,
  UpdateFolderFunction,
  HelpExamplesFunction,
} from './types.js';

const execAsync = promisify(exec);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const readdirAsync = promisify(readdir);

/**
 * Install prop-types package
 */
export const installPackage: InstallPackageFunction = async (): Promise<void> => {
  console.log('');
  try {
    // Check if the package is installed in the project
    await import('prop-types');
    console.log(`${chalk.cyan.underline.bold('prop-types')} is already installed in your project`);
  } catch {
    console.log('Installing prop-types to your project');
    try {
      const { stdout: installOutput, stderr } = await execAsync('pnpm add prop-types');
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        console.log('');
        return;
      }
      // the *entire* stdout (buffered)
      console.log(`${chalk.hex('#FF6347').bold('Installation underway')}`);
      console.log(installOutput);
      console.log(`${chalk.cyan.underline.bold('prop-types')} is now installed`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error installing prop-types:', errorMessage);
    }
  }
};

const REACT_IMPORT = /^import\s+([^;]*?)\s+from\s*(['"])react\2;?[ \t]*\n?/gm;
const REACT_REQUIRE = /^.*\brequire\(\s*(['"])react\1\s*\).*\n?/m;
const PROP_TYPES_IMPORTED = /^\s*import\s+PropTypes\s+from\s*(['"])prop-types\1/m;
const REACT_PROP_TYPES = /\bReact\.PropTypes\b/g;
const USES_REACT_PROP_TYPES = /\bReact\.PropTypes\b/;
const PROP_TYPES_IMPORT = "import PropTypes from 'prop-types';\n";
const PROP_TYPES_REQUIRE = "const PropTypes = require('prop-types');\n";

/**
 * Remove a `PropTypes` named import from the clause of one `import ... from 'react'`
 * statement. Returns the new clause ('' when nothing is left) or null if the clause
 * does not import PropTypes.
 */
const removePropTypesSpecifier = (clause: string): string | null => {
  const braces = /\{([^}]*)\}/.exec(clause);
  if (!braces) {
    return null;
  }
  const named = (braces[1] ?? '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  if (!named.includes('PropTypes')) {
    return null;
  }
  const remaining = named.filter((name) => name !== 'PropTypes');
  const defaultPart = clause.slice(0, braces.index).replace(/,\s*$/, '').trim();
  const namedPart = remaining.length ? `{ ${remaining.join(', ')} }` : '';
  return [defaultPart, namedPart].filter(Boolean).join(', ');
};

/**
 * Convert one source file from `React.PropTypes` to the `prop-types` package.
 * Only the react import statement and `React.PropTypes` references are changed.
 * Returns the new source, or null when the file needs no change.
 */
export const transformSource = (source: string): string | null => {
  if (PROP_TYPES_IMPORTED.test(source)) {
    return null;
  }

  let removedSpecifier = false;
  let insertAt = -1;
  let result = source.replace(
    REACT_IMPORT,
    (statement: string, clause: string, quote: string, offset: number): string => {
      const newClause = removePropTypesSpecifier(clause);
      let replacement = statement;
      if (newClause !== null) {
        removedSpecifier = true;
        const lineEnd = statement.endsWith('\n') ? '\n' : '';
        const semicolon = /;[ \t]*\n?$/.test(statement) ? ';' : '';
        replacement = newClause
          ? `import ${newClause} from ${quote}react${quote}${semicolon}${lineEnd}`
          : '';
      }
      // The first react import has no earlier replacement, so its offset is also valid in the result
      if (insertAt === -1) {
        insertAt = offset + replacement.length;
      }
      return replacement;
    }
  );

  if (!removedSpecifier && !USES_REACT_PROP_TYPES.test(result)) {
    return null;
  }

  // Insert before replacing React.PropTypes, which shifts later offsets
  if (insertAt !== -1) {
    const needsNewline = insertAt > 0 && result[insertAt - 1] !== '\n';
    result = `${result.slice(0, insertAt)}${needsNewline ? '\n' : ''}${PROP_TYPES_IMPORT}${result.slice(insertAt)}`;
  } else {
    const requireLine = REACT_REQUIRE.exec(result);
    if (requireLine) {
      const end = requireLine.index + requireLine[0].length;
      const needsNewline = !requireLine[0].endsWith('\n');
      result = `${result.slice(0, end)}${needsNewline ? '\n' : ''}${PROP_TYPES_REQUIRE}${result.slice(end)}`;
    } else {
      result = `${PROP_TYPES_IMPORT}${result}`;
    }
  }

  return result.replace(REACT_PROP_TYPES, 'PropTypes');
};

/**
 * Write file with ES6 prop-types conversion
 */
const writeFileAsyncEs6 = async (fileAndPath: string): Promise<void> => {
  try {
    const data = await readFileAsync(fileAndPath, fileEncoding);
    const newData = transformSource(data.toString());
    if (newData === null) {
      return;
    }

    await writeFileAsync(fileAndPath, newData, fileEncoding);
    console.log(`${chalk.magenta.italic(fileAndPath)} just got ${chalk.green('updated')}!`);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing file ${fileAndPath}:`, errorMessage);
  }
};

/**
 * Write file with ES5 prop-types conversion (legacy support)
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
const writeFileAsyncEs5 = async (fileAndPath: string): Promise<void> => {
  try {
    const data = await readFileAsync(fileAndPath, fileEncoding);
    const dataString = data.toString();
    let newData = dataString.replace(/React\.PropTypes[.]?/g, 'PropTypes.');
    newData = newData.replace(/const PropTypes = require\('react'\)\.PropTypes;$/g, '');
    newData = newData.replace(/{PropTypes} = require\('react'\)\.PropTypes/g, '');
    newData = [
      newData.slice(0, newData.indexOf("';\n") + 2),
      importState,
      newData.slice(newData.indexOf("';\n") + 2),
    ].join('');

    if (newData) {
      await writeFileAsync(fileAndPath, newData, fileEncoding);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing file ${fileAndPath}:`, errorMessage);
  }
};

/**
 * Update a single file
 */
export const updateFile: UpdateFileFunction = async (
  cmd: string,
  fileAndPath: string
): Promise<void> => {
  if (!fileAndPath) {
    console.error('No file path provided');
    return;
  }

  let targetPath = fileAndPath;

  // Handle file extension validation
  if (/[.]/.exec(targetPath)) {
    if (!/\S+\.(jsx?|tsx?)$/.test(targetPath)) {
      console.log(`Skipping ${targetPath} - not a .js, .jsx, .ts, or .tsx file`);
      return;
    }
  } else {
    // Try to find the file with .js, .jsx, .ts, or .tsx extension
    const fs = await import('fs');
    const statAsync = promisify(fs.stat);
    const extensions = ['.js', '.jsx', '.ts', '.tsx'];
    let found = false;
    
    for (const ext of extensions) {
      try {
        await statAsync(`${targetPath}${ext}`);
        targetPath = `${targetPath}${ext}`;
        found = true;
        break;
      } catch (err) {
        // Continue to next extension
      }
    }
    
    if (!found) {
      console.log(
        `${chalk.magenta.italic(targetPath)} doesn't ${chalk.red.inverse(
          'seem to exist in the given path'
        )} with extensions .js, .jsx, .ts, or .tsx`
      );
      return;
    }
  }

  await writeFileAsyncEs6(targetPath);
};

/**
 * Update all files in a folder recursively
 */
export const updateFolder: UpdateFolderFunction = async (
  cmd: string,
  folderName: string
): Promise<void> => {
  console.log('');
  try {
    const entries = (await readdirAsync(folderName)).map((name) => ({
      name,
      stats: lstatSync(`${folderName}/${name}`),
    }));

    // Never follow symbolic links: they can point outside the target folder
    const links = entries.filter(({ stats }) => stats.isSymbolicLink());
    for (const { name } of links) {
      console.log(`Skipping symbolic link ${folderName}/${name}`);
    }
    const files = entries.filter(({ stats }) => !stats.isSymbolicLink());

    const folderInFolder = files
      .filter(({ stats }) => stats.isDirectory())
      .map(({ name }) => name);

    // Process subdirectories recursively
    for (const folder of folderInFolder) {
      await updateFolder('updateFolder', `${folderName}/${folder}`);
    }

    const filesInFolder = files
      .filter(({ stats }) => stats.isFile())
      .map(({ name }) => name);

    // Process files in current directory (filter for supported file types)
    const supportedFiles = filesInFolder.filter(file => 
      /\.(jsx?|tsx?)$/.test(file)
    );
    
    for (const file of supportedFiles) {
      await updateFile('updateFolder', `${folderName}/${file}`);
    }

    console.log('');
    console.log(
      `folder ${chalk.underline.yellowBright(folderName)} and js/jsx/ts/tsx files inside are now ${chalk.greenBright(
        'ready'
      )}!`
    );
    stdout.write('\x1b[2J');
    stdout.write('\x1b[0f');
    console.log(
      `Your folder and files have been updated. Thank you for using ${chalk.yellowBright(
        'move-prop-types'
      )}`
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing folder ${folderName}:`, errorMessage);
  }
};

/**
 * Display help examples
 */
export const helpExamples: HelpExamplesFunction = (): string => {
  return `
  Examples:
    $ move-prop-types --help for info
    $ move-prop-types -P ../dir1/dir2/filename.[js|jsx|ts|tsx] - This will run replace only on the given file.
    $ move-prop-types -F ../dir1/dir2 - This will run the update for all the files inside the given directory
    $ move-prop-types -I -F ../dir1/dir2 - This will install prop-types to dependencies and run the update for all the files inside the given directory
`;
};

/**
 * Find matching value in array
 */
export const findMatch: FindMatchFunction = (
  givenValue: string[],
  setToMatch: string[]
): string => {
  if (!Array.isArray(givenValue)) {
    return '';
  }

  let index = 0;
  givenValue.filter((val) => {
    if (val === setToMatch[0] || val === setToMatch[1]) {
      index = givenValue.indexOf(val) + 1;
    }
  });

  return index && index < givenValue.length ? givenValue[index] || '' : '';
};
