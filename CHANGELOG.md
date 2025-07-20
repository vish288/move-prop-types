# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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