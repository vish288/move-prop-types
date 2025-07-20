# [1.1.0](https://github.com/vish288/move-prop-types/compare/v1.0.0...v1.1.0) (2025-07-20)


### Features

* add automated missing versions publisher ([b05c8b9](https://github.com/vish288/move-prop-types/commit/b05c8b9586685cfdea502d82b31f5a3f86880aef))
* enable npm publishing in semantic-release ([a9c4496](https://github.com/vish288/move-prop-types/commit/a9c4496ab4a2e16cc874b1ff70e5575842e67795))
* rename beta version and create historical releases ([d44de7e](https://github.com/vish288/move-prop-types/commit/d44de7edf4393722222ff0be8f743a7c3ddd4f78))

# [1.0.0](https://github.com/vish288/move-prop-types/compare/v0.8.3...v1.0.0) (2025-07-20)


### Bug Fixes

* add back semantic-release dependencies for GitHub Actions ([7c1ccf1](https://github.com/vish288/move-prop-types/commit/7c1ccf19f875b0389e0f7d8de52a7756fd6a8238))
* add support for PropTypes in middle of import list and fix integration tests ([7075be0](https://github.com/vish288/move-prop-types/commit/7075be08076d207cbdd9588611d7a6b7a5971f61))
* correct workflow step order in release.yml - build before tests ([4bde4be](https://github.com/vish288/move-prop-types/commit/4bde4bea579e579dd5afb6945c9f8581d59745de))
* optimize regex patterns and resolve configuration issues ([bf5428e](https://github.com/vish288/move-prop-types/commit/bf5428e59d812cae64ef76bedd03f0743e535afc))
* resolve duplicate import ESLint error in ast-transformer ([a3b04bc](https://github.com/vish288/move-prop-types/commit/a3b04bc4d8bb4a7997c35341fb9823c54be1fba5))
* resolve ESLint warnings and unused variable issues ([0de190e](https://github.com/vish288/move-prop-types/commit/0de190e1e6211409cf6647d210579b1d051131df))
* resolve test failures and improve CI reliability ([aa3c2bf](https://github.com/vish288/move-prop-types/commit/aa3c2bf65c763b413702c30eec50c5b8150ac784))
* temporarily disable npm publishing in semantic-release ([263e49c](https://github.com/vish288/move-prop-types/commit/263e49c1b6b04772b31d0e4193a0306d6a2509ed))


### Features

* add modern release tooling, comprehensive changelog, and enhanced documentation ([04ca446](https://github.com/vish288/move-prop-types/commit/04ca446e36ecf785d723075d96b53b04597700fa))
* add verification infrastructure and fix test execution ([3497472](https://github.com/vish288/move-prop-types/commit/3497472f07a5590b72bc73201509e586dae5bf8e))
* **ast:** implement experimental AST-based transformation ([cf57ad6](https://github.com/vish288/move-prop-types/commit/cf57ad61cf13f22c3fec4d30115f5b21db5e79dc))
* modernize testing infrastructure to TypeScript and remove build dependencies ([15f63cb](https://github.com/vish288/move-prop-types/commit/15f63cb8a067cd73082b10c490014cd0eeb9e68a))
* **typescript:** add support for .ts and .tsx file extensions ([bc45611](https://github.com/vish288/move-prop-types/commit/bc456119bd52d29c6d55e7ec308403b0ad7acef4))


### BREAKING CHANGES

* **typescript:** Tool now processes TypeScript files in addition to JavaScript files

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.20.1-beta.1] - 2025-07-20

### Features

* **typescript-files**: Added support for TypeScript (.ts) and TSX (.tsx) files
* **ast-transformation**: Implemented experimental AST-based transformation with Babel
* **file-extension-support**: Extended file type support from .js/.jsx to .js/.jsx/.ts/.tsx
* **enhanced-pattern-detection**: Improved PropTypes detection for complex import patterns
* **modern-testing**: Enhanced test coverage with TypeScript file transformation tests

### Code Refactoring

* **helper**: Extended regex-based helper to support TypeScript file extensions
* **ast-implementation**: Created comprehensive AST-based transformation as alternative approach
* **constants**: Added new regex patterns for middle-position PropTypes imports
* **types**: Enhanced TypeScript definitions for better type safety

### Documentation

* **readme**: Updated with TypeScript examples and enhanced feature documentation
* **typescript-examples**: Added comprehensive TypeScript component transformation examples
* **file-support**: Updated all documentation to reflect .ts/.tsx file support

### Testing

* **typescript-coverage**: Added comprehensive tests for TypeScript file transformations
* **ast-testing**: Complete test suite for AST-based transformation features
* **integration-tests**: Enhanced real-world scenario testing with TypeScript files

### Build System

* **babel-dependencies**: Added Babel AST parsing dependencies for advanced transformations
* **rollup-optimization**: Optimized bundling configuration for new dependencies

## [0.10.0](https://github.com/vish288/move-prop-types/compare/v0.8.3...v0.10.0) (2025-07-20)

### Features

* **typescript**: Complete migration from JavaScript to TypeScript with strict typing
* **tooling**: Modern build pipeline with TypeScript compilation and Rollup bundling
* **testing**: Comprehensive test suite with Vitest, unit and integration tests
* **package-manager**: Migration from npm to pnpm for better performance
* **developer-experience**: Modern ESLint 9, Prettier, and Husky configuration
* **documentation**: Extensive README, CONTRIBUTING, SECURITY, and CODEOWNERS files

### Breaking Changes

* Minimum Node.js version requirement increased from 5+ to 18+
* Build output structure changed due to TypeScript compilation
* Package manager recommendation changed from npm to pnpm

### Code Refactoring

* **core**: Migrate core.js to core.ts with proper TypeScript types
* **helper**: Migrate helper.js to helper.ts with comprehensive type definitions
* **constants**: Migrate constants.js to constants.ts with typed exports
* **build**: Modern Rollup 4 configuration with latest plugins

### Build System

* **typescript**: Added TypeScript 5.7 with strict configuration
* **rollup**: Updated to Rollup 4 with modern plugins
* **eslint**: Upgraded to ESLint 9 with TypeScript support
* **vitest**: Modern testing framework replacing basic npm test

### Documentation

* **readme**: Complete rewrite with modern badges and comprehensive examples
* **contributing**: Detailed contribution guidelines and development setup
* **security**: Security policy and vulnerability reporting process
* **codeowners**: Code review assignments and ownership

### Performance Improvements

* **dependencies**: Updated all dependencies to latest stable versions
* **build**: Optimized build pipeline with TypeScript and modern bundling
* **package-manager**: Faster installs and better dependency resolution with pnpm

---

## [0.8.3] - Previous Releases

See git history for changes prior to the TypeScript modernization.
