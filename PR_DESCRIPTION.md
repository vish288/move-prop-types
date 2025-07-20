# TypeScript Support and AST-based Transformation

## Summary

This PR introduces comprehensive TypeScript support and experimental AST-based transformation capabilities to move-prop-types, marking the v0.20.1-beta.1 release.

### 🚀 Key Features

- **TypeScript File Support**: Extended support from .js/.jsx to .js/.jsx/.ts/.tsx files
- **AST-based Transformation**: Implemented experimental Babel-based AST transformation for more accurate code transformations
- **Enhanced Pattern Detection**: Improved PropTypes detection for complex import patterns including middle-position imports
- **Comprehensive Testing**: Added extensive test coverage for TypeScript files and AST transformations

### 📋 Changes Overview

#### Core Features
- ✅ **TypeScript Support**: Full support for .ts and .tsx files with TypeScript syntax preservation
- ✅ **AST Implementation**: Experimental AST-based transformation using Babel parser and traversal
- ✅ **Enhanced Regex Patterns**: Added detection for PropTypes in middle positions of import statements
- ✅ **File Extension Validation**: Updated file discovery to handle all supported extensions

#### Infrastructure
- ✅ **Build System**: Added Babel dependencies and optimized Rollup configuration
- ✅ **Testing**: 55 comprehensive tests including TypeScript and AST transformation scenarios
- ✅ **Documentation**: Updated README with TypeScript examples and new feature documentation
- ✅ **Type Safety**: Enhanced TypeScript definitions and linting rules

### 🧪 Testing

All tests pass (55/55):
- Unit tests for helper, AST transformer, constants, and core modules
- Integration tests with real-world transformation scenarios
- TypeScript file transformation validation
- Edge case handling and error scenarios

### 📖 Documentation

- Updated README with TypeScript support examples
- Added comprehensive transformation examples for .ts/.tsx files
- Enhanced feature documentation with AST capabilities
- Updated project structure and usage examples

### 🔧 Technical Implementation

#### TypeScript Support
```typescript
// Before
import React, { FC, PropTypes } from 'react';

MyComponent.propTypes = {
  title: React.PropTypes.string.isRequired
};

// After
import React, { FC } from 'react';
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  title: PropTypes.string.isRequired
};
```

#### AST Implementation
- Babel-based parsing with TypeScript plugin support
- Robust error handling and fallback mechanisms
- Preserves TypeScript syntax, interfaces, and type annotations
- More accurate transformation for complex patterns

### 🎯 Breaking Changes

- Now processes TypeScript files (.ts/.tsx) in folder operations
- Requires Node.js 18+ (already established in v0.10.0)

### 🚦 Release Notes

This is a **beta release** introducing major new features. The regex-based transformation remains the default for CLI operations to ensure compatibility, while AST-based transformation is available as an experimental alternative.

## Test Plan

- [x] All existing tests pass
- [x] TypeScript file transformations work correctly
- [x] AST transformations handle complex patterns
- [x] CLI maintains backward compatibility
- [x] Build process generates correct output
- [x] Linting and type checking pass

🤖 Generated with assistance