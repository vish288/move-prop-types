# move-prop-types

[![npm version](https://img.shields.io/npm/v/move-prop-types.svg)](https://www.npmjs.com/package/move-prop-types)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

move-prop-types is a command-line tool. It changes React source files that use `React.PropTypes` so that they use the `prop-types` package.

React 15.5 moved PropTypes out of the `react` package. React 16 and later do not include `React.PropTypes`. Use this tool to update old code before you upgrade React.

## What the tool changes

The tool reads `.js`, `.jsx`, `.ts` and `.tsx` files. For each file that imports `PropTypes` from `react`, the tool does these steps:

1. It removes `PropTypes` from the `react` import.
2. It adds `import PropTypes from 'prop-types';`.
3. It replaces each `React.PropTypes.` with `PropTypes.`.

The tool does not change files that already import `prop-types`.

**Before:**

```jsx
import React, { Component, PropTypes } from 'react';

class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

Greeting.propTypes = {
  name: React.PropTypes.string.isRequired,
  tags: React.PropTypes.arrayOf(React.PropTypes.string),
};

export default Greeting;
```

**After:**

```jsx
import React, { Component } from 'react';

import PropTypes from 'prop-types';
class Greeting extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

Greeting.propTypes = {
  name: PropTypes.string.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string) };

export default Greeting;
```

The tool does not format the code. Run your formatter (for example, Prettier) after the tool.

## Requirements

- Node.js 24 or later.
- pnpm, only if you use the `-I` option.

## Install

Install the tool globally:

```bash
npm install --global move-prop-types
```

You can also use pnpm (`pnpm add --global move-prop-types`) or Yarn (`yarn global add move-prop-types`).

To run the tool one time without an installation, use `npx`:

```bash
npx move-prop-types -F src
```

## Update a project

1. Commit or back up your code. The tool writes over the files.
2. Go to the root folder of your project.
3. Run the tool on the folder that contains your source files:

   ```bash
   mpt -I -F src
   ```

4. Examine the changes, for example with `git diff`.
5. Run your formatter.
6. Run your tests.

## Commands

The tool has two command names: `move-prop-types` and `mpt`.

| Option | Description |
| --- | --- |
| `-P, --path <file>` | Update one file. |
| `-F, --folder <folder>` | Update all `.js`, `.jsx`, `.ts` and `.tsx` files in the folder and its subfolders. |
| `-I, --install` | Install `prop-types` in the current folder with `pnpm add prop-types`, then continue. |
| `-V, --version` | Show the version number. |
| `-h, --help` | Show the help. |

You must give `-P` or `-F`. A path without an option shows the help only.

Examples:

```bash
# Update one file
mpt -P src/components/Button.jsx

# Update all files in a folder
mpt -F src/components

# Install prop-types, then update all files in src
mpt -I -F src
```

## Limits

- The tool changes a file only if the file imports `PropTypes` from `react`, for example `import React, { PropTypes } from 'react';`. If a file uses `React.PropTypes` and does not import `PropTypes`, the tool does not change it. Update these files manually.
- The tool does not follow symbolic links in a folder. It shows a message for each link that it skips.
- If you give a file path without an extension, the tool tries `.js`, `.jsx`, `.ts` and `.tsx` in that sequence.

## Upgrade from version 1

Version 2 requires Node.js 24 or later. The commands and options did not change. If you must use Node.js 20 or 22, use version 1:

```bash
npm install --global move-prop-types@1
```

## Get help

- To report a problem or ask for a new function, [open an issue](https://github.com/vish288/move-prop-types/issues).
- To report a security vulnerability, read the [security policy](SECURITY.md). Do not open a public issue.
- To change the code, read the [contribution guide](CONTRIBUTING.md).

## License

[MIT](LICENSE)
