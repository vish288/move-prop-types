# Contributing to move-prop-types

Thank you for your interest in contributing to move-prop-types! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- pnpm (recommended) or npm
- Git

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/move-prop-types.git
   cd move-prop-types
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Build the Project**
   ```bash
   pnpm run build
   ```

4. **Run Tests**
   ```bash
   pnpm test
   ```

## 🛠️ Development Workflow

### Project Structure
```
├── src/
│   ├── core.ts          # CLI command setup and argument parsing
│   ├── helper.ts        # Core transformation logic
│   ├── constants.ts     # Regular expressions and constants
│   ├── types.ts         # TypeScript type definitions
│   └── updateFile.ts    # Build utility for adding shebang
├── test/
│   ├── unit/           # Unit tests for individual modules
│   └── integration/    # Integration tests for real-world scenarios
├── build/              # Compiled output (generated)
└── package.json        # Project configuration
```

### Available Scripts

- `pnpm run build` - Build the TypeScript project
- `pnpm run dev` - Watch mode for development
- `pnpm test` - Run the test suite
- `pnpm run test:coverage` - Run tests with coverage report
- `pnpm run lint` - Check and fix linting issues
- `pnpm run format` - Format code with Prettier
- `pnpm run typecheck` - Type checking without emitting files

### Making Changes

1. **Create a Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Your Changes**
   - Write clean, well-documented TypeScript code
   - Follow the existing code style and patterns
   - Add tests for new functionality

3. **Test Your Changes**
   ```bash
   pnpm run build
   pnpm test
   pnpm run lint
   ```

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: describe your changes"
   ```

## 📝 Code Style Guidelines

### TypeScript
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` types - use proper typing
- Use async/await instead of Promises where possible

### Code Organization
- Keep functions focused and single-purpose
- Use descriptive variable and function names
- Add JSDoc comments for public APIs
- Handle errors gracefully with proper error messages

### Testing
- Write unit tests for new functions
- Add integration tests for complex workflows
- Maintain test coverage above 80%
- Use descriptive test names and organize with `describe` blocks

## 🧪 Testing Guidelines

### Unit Tests
Located in `test/unit/`, these test individual functions:
```typescript
import { describe, it, expect } from 'vitest';
import { yourFunction } from '../../build/your-module.js';

describe('yourFunction', () => {
  it('should handle normal input correctly', () => {
    const result = yourFunction('input');
    expect(result).toBe('expected');
  });
});
```

### Integration Tests
Located in `test/integration/`, these test complete workflows:
```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { updateFile } from '../../build/helper.js';

describe('Real-world transformation', () => {
  // Test complete file transformations
});
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Clear Description** - What happened vs. what you expected
2. **Steps to Reproduce** - Minimal steps to recreate the issue
3. **Environment** - Node.js version, OS, package version
4. **Code Sample** - Minimal code that demonstrates the issue
5. **Error Messages** - Full error output if applicable

## ✨ Feature Requests

For new features:

1. **Check Existing Issues** - Ensure it hasn't been requested
2. **Describe the Use Case** - Why is this feature needed?
3. **Propose Implementation** - How should it work?
4. **Consider Breaking Changes** - Will this affect existing users?

## 📋 Pull Request Process

1. **Fork the Repository**
2. **Create Feature Branch** from `main`
3. **Make Changes** following our guidelines
4. **Add Tests** for new functionality
5. **Update Documentation** if needed
6. **Ensure CI Passes** - All tests and linting must pass
7. **Create Pull Request** with clear description

### Pull Request Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
```

## 🏷️ Commit Message Format

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add support for TypeScript files
fix: handle edge case in import parsing
docs: update README with new examples
test: add integration tests for folder processing
```

## 🎯 Areas for Contribution

We welcome contributions in these areas:

- **Core Functionality**
  - Improved regex patterns for edge cases
  - Better error handling and user feedback
  - Performance optimizations

- **Testing**
  - More comprehensive test coverage
  - Edge case testing
  - Performance testing

- **Documentation**
  - Better examples and use cases
  - Video tutorials or guides
  - API documentation improvements

- **Developer Experience**
  - Better TypeScript types
  - Improved build process
  - Development tooling

## 🤝 Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and improve
- Follow our community guidelines

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and community chat
- **Code Review** - Request reviews on pull requests

## 🙏 Recognition

Contributors will be:
- Listed in our README acknowledgments
- Credited in release notes for significant contributions
- Given GitHub contributor status

Thank you for contributing to move-prop-types! 🎉