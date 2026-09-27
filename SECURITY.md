# Security Policy

## Supported Versions

Security fixes are released for the latest major version only.

| Version | Supported |
| ------- | --------- |
| 2.x     | ✅ Yes    |
| < 2.0   | ❌ No     |

## Reporting a Vulnerability

Please **do not open a public issue** for security vulnerabilities.

Report privately through GitHub:
**Security → Advisories → [Report a vulnerability](https://github.com/vish288/move-prop-types/security/advisories/new)**.

Include a description, steps to reproduce, the affected version, and the potential impact.
A suggested fix is welcome but not required.

### What to expect

- Acknowledgement within **3 business days**
- An initial assessment within **7 days**
- A fix and coordinated disclosure through a GitHub Security Advisory, with credit to the
  reporter if they wish

## Scope and Safe Use

move-prop-types rewrites JavaScript and TypeScript source files in place.

- It only writes regular files inside the path given with `-P` or the folder given with `-F`.
  Symbolic links found while walking a folder are skipped and reported, never followed.
- `-I` runs `pnpm add prop-types` in the current directory. No user input is passed to the shell.
- Commit or back up your code first and review the diff before committing the result.

## Supply Chain

- Releases are published from GitHub Actions through
  [npm trusted publishing](https://docs.npmjs.com/trusted-publishers) with
  [provenance](https://docs.npmjs.com/generating-provenance-statements). Verify with
  `npm audit signatures`.
- Dependabot keeps npm dependencies and GitHub Actions up to date; pull requests go through
  dependency review and CodeQL code scanning.
- GitHub Actions are pinned to commit SHAs, and workflow tokens are read-only by default.
- Dependency install scripts do not run unless explicitly allowed in `pnpm-workspace.yaml`.
