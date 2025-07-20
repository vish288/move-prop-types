# move-prop-types

[![npm version](https://badge.fury.io/js/move-prop-types.svg)](https://badge.fury.io/js/move-prop-types)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, TypeScript-based CLI tool that automatically refactors your React codebase to use the standalone `prop-types` package instead of the deprecated `React.PropTypes`.

## 🚀 Why move-prop-types?

When React v15.5 was released in 2017, PropTypes was deprecated from the core React package and moved to a separate `prop-types` package. Many legacy React projects still use the old `React.PropTypes` syntax, which is no longer supported in modern React versions.

This CLI tool automates the migration process by:

- ✅ **Detecting legacy PropTypes usage** - Scans for `React.PropTypes` patterns
- ✅ **Removing PropTypes from React imports** - Cleans up `import { PropTypes }` from React
- ✅ **Adding standalone prop-types import** - Adds `import PropTypes from 'prop-types'`
- ✅ **Replacing usage patterns** - Changes `React.PropTypes.string` to `PropTypes.string`
- ✅ **Handling complex nested patterns** - Supports complex PropTypes like `PropTypes.arrayOf(PropTypes.shape(...))`
- ✅ **Processing entire codebases** - Recursively processes directories and subdirectories
- ✅ **Installing dependencies** - Optionally installs the `prop-types` package automatically

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

# Transform with automatic prop-types installation
mpt -I -P src/components/UserProfile.jsx

# Transform a file with relative path
mpt -P ./components/Header.js

# Transform multiple files (run command for each)
mpt -P src/components/Button.jsx
mpt -P src/components/Modal.jsx
mpt -P src/utils/validators.js
```

### Transform an Entire Directory
```bash
# Transform all .js/.jsx files in src directory recursively
mpt -F src

# Transform entire project with prop-types installation
mpt -I -F .

# Transform specific subdirectories
mpt -F src/components
mpt -F src/pages
mpt -F src/utils

# Large project with automatic dependency installation
mpt -I -F src
```

### Real-World Migration Scenarios

#### Legacy React Project
```bash
# 1. Install move-prop-types globally
npm install -g move-prop-types

# 2. Navigate to your React project
cd my-react-project

# 3. Install prop-types and transform entire codebase
mpt -I -F src

# 4. Verify changes and test your application
npm test
```

#### Migrating Specific Components
```bash
# Transform only component files
mpt -F src/components

# Transform only utility files that use PropTypes
mpt -P src/utils/propTypeValidators.js
mpt -P src/hoc/withPropTypes.js
```

### Before and After Examples

#### Simple Component Migration
**Before transformation:**
```javascript
import React, { Component, PropTypes } from 'react';

class UserProfile extends Component {
  render() {
    const { name, email, age, isActive } = this.props;
    return (
      <div className="user-profile">
        <h2>{name}</h2>
        <p>Email: {email}</p>
        <p>Age: {age}</p>
        {isActive && <span className="active">Active User</span>}
      </div>
    );
  }
}

UserProfile.propTypes = {
  name: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
  age: React.PropTypes.number,
  isActive: React.PropTypes.bool
};

UserProfile.defaultProps = {
  age: 0,
  isActive: false
};

export default UserProfile;
```

**After transformation:**
```javascript
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class UserProfile extends Component {
  render() {
    const { name, email, age, isActive } = this.props;
    return (
      <div className="user-profile">
        <h2>{name}</h2>
        <p>Email: {email}</p>
        <p>Age: {age}</p>
        {isActive && <span className="active">Active User</span>}
      </div>
    );
  }
}

UserProfile.propTypes = {
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  age: PropTypes.number,
  isActive: PropTypes.bool
};

UserProfile.defaultProps = {
  age: 0,
  isActive: false
};

export default UserProfile;
```

#### Complex PropTypes Migration
**Before transformation:**
```javascript
import React, { PropTypes } from 'react';

const DataTable = ({ data, columns, onRowClick, pagination, loading }) => {
  // Component implementation
  return <div>DataTable Component</div>;
};

DataTable.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  columns: React.PropTypes.arrayOf(React.PropTypes.shape({
    key: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    render: React.PropTypes.func,
    sortable: React.PropTypes.bool
  })).isRequired,
  onRowClick: React.PropTypes.func,
  pagination: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.shape({
      page: React.PropTypes.number,
      pageSize: React.PropTypes.number,
      total: React.PropTypes.number
    })
  ]),
  loading: React.PropTypes.bool
};

export default DataTable;
```

**After transformation:**
```javascript
import React from 'react';
import PropTypes from 'prop-types';

const DataTable = ({ data, columns, onRowClick, pagination, loading }) => {
  // Component implementation
  return <div>DataTable Component</div>;
};

DataTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    render: PropTypes.func,
    sortable: PropTypes.bool
  })).isRequired,
  onRowClick: PropTypes.func,
  pagination: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      page: PropTypes.number,
      pageSize: PropTypes.number,
      total: PropTypes.number
    })
  ]),
  loading: PropTypes.bool
};

export default DataTable;
```

#### Functional Component Migration
**Before transformation:**
```javascript
import React, { PropTypes } from 'react';

function Button({ label, onClick, disabled, variant, size }) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant} btn-${size}`}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool,
  variant: React.PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: React.PropTypes.oneOf(['small', 'medium', 'large'])
};

Button.defaultProps = {
  disabled: false,
  variant: 'primary',
  size: 'medium'
};

export default Button;
```

**After transformation:**
```javascript
import React from 'react';
import PropTypes from 'prop-types';

function Button({ label, onClick, disabled, variant, size }) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`btn btn-${variant} btn-${size}`}
    >
      {label}
    </button>
  );
}

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  size: PropTypes.oneOf(['small', 'medium', 'large'])
};

Button.defaultProps = {
  disabled: false,
  variant: 'primary',
  size: 'medium'
};

export default Button;
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
