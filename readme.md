# move-prop-types

[![npm version](https://badge.fury.io/js/move-prop-types.svg)](https://badge.fury.io/js/move-prop-types)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, TypeScript-based CLI tool that automatically refactors your React codebase to use the standalone `prop-types` package instead of the deprecated `React.PropTypes`.

## 🚀 Why move-prop-types?

When React v15.5 was released, PropTypes was moved from the core React package to a separate `prop-types` package. This tool automates the tedious process of:

- ✅ Removing `PropTypes` from React imports
- ✅ Adding the standalone `prop-types` import
- ✅ Replacing `React.PropTypes` with `PropTypes` throughout your code
- ✅ Handling complex nested PropTypes patterns
- ✅ Processing entire project directories recursively

## 📦 Installation

### Global Installation (Recommended)
```bash
npm install -g move-prop-types
# or with pnpm
pnpm add -g move-prop-types
```

### Local Installation
```bash
npm install --save-dev move-prop-types
# or with pnpm
pnpm add --save-dev move-prop-types
```

## 🛠️ Usage

```bash
Usage: move-prop-types|mpt [options] [file|folder]

Options:
  -V, --version          output the version number
  -I, --install          install prop-types package and continue with transformation
  -P, --path <path>      transform a specific file
  -F, --folder <folder>  transform all .js/.jsx files in a folder (recursive)
  -h, --help             display help for command
```

## 📖 Examples

### Transform a Single File
```bash
# Transform a specific component file
mpt -P src/components/UserProfile.jsx

# With automatic prop-types installation
mpt -I -P src/components/UserProfile.jsx
```

### Transform an Entire Directory
```bash
# Transform all .js/.jsx files in src directory recursively
mpt -F src

# Transform with prop-types installation
mpt -I -F src
```

### Before and After

**Before transformation:**
```javascript
import React, { Component, PropTypes } from 'react';

class UserProfile extends Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}

UserProfile.propTypes = {
  name: React.PropTypes.string.isRequired,
  age: React.PropTypes.number,
  interests: React.PropTypes.arrayOf(React.PropTypes.string)
};
```

**After transformation:**
```javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserProfile extends Component {
  render() {
    return <div>{this.props.name}</div>;
  }
}

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  interests: PropTypes.arrayOf(PropTypes.string)
};
```

## 🏗️ Features

- **TypeScript Support**: Built with TypeScript for better reliability and type safety
- **Modern Tooling**: Uses latest ESLint, Prettier, and build tools
- **Comprehensive Testing**: Full test suite with unit and integration tests
- **Recursive Processing**: Handles entire directory structures
- **Smart Detection**: Only processes files that actually use PropTypes
- **Safe Transformations**: Preserves existing prop-types imports
- **Multiple Import Patterns**: Handles various React import styles

## 🧪 Development

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Setup
```bash
# Clone the repository
git clone https://github.com/vish288/move-prop-types.git
cd move-prop-types

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run tests
pnpm test

# Run linting
pnpm run lint
```

### Project Structure
```
src/
├── core.ts          # CLI command setup and argument parsing
├── helper.ts         # Core transformation logic
├── constants.ts      # Regular expressions and constants
├── types.ts          # TypeScript type definitions
└── updateFile.ts     # Build utility for adding shebang

test/
├── unit/            # Unit tests for individual modules
└── integration/     # Integration tests for real-world scenarios
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Requirements

- **Node.js**: Version 18 or higher
- **File Types**: Supports `.js` and `.jsx` files
- **React Versions**: Compatible with all React versions that used `React.PropTypes`

## 🐛 Issues

If you encounter any issues or have feature requests, please [open an issue](https://github.com/vish288/move-prop-types/issues) on GitHub.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React team for the smooth transition process
- The community for feedback and contributions
- All users who have helped improve this tool
