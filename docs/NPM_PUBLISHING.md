# npm Publishing

Releases are fully automated. Every push to `main` runs the **Publish**
workflow (`.github/workflows/publish.yml`), where
[semantic-release](https://github.com/semantic-release/semantic-release) decides the
next version from the commit messages, tags the commit, publishes to npm and creates
a GitHub release.

## How versions are chosen

| Commit type                                  | Release |
| -------------------------------------------- | ------- |
| `fix:` / `perf:`                             | patch   |
| `feat:`                                      | minor   |
| `BREAKING CHANGE:` footer or `type!:` header | major   |
| `build:`, `ci:`, `docs:`, `chore:`, ...      | none    |

Pull requests are merged with a merge commit so each conventional commit is
analysed individually.

## Authentication: npm trusted publishing

The workflow publishes with [npm trusted publishing](https://docs.npmjs.com/trusted-publishers):
GitHub issues a short-lived OIDC token to the release job (`id-token: write`) that
npm exchanges for a one-time publish credential. No long-lived npm token is stored,
and every release gets a [provenance attestation](https://docs.npmjs.com/generating-provenance-statements)
automatically.

### One-time setup on npmjs.com

1. Open <https://www.npmjs.com/package/move-prop-types/access>.
2. Under **Trusted Publisher**, choose **GitHub Actions** and enter:
   - Organization or user: `vish288`
   - Repository: `move-prop-types`
   - Workflow filename: `publish.yml`
   - Environment: _(leave empty)_
3. Save. Optionally set **Publishing access** to
   _"Require two-factor authentication and disallow tokens"_ so only the trusted
   publisher can publish.
4. Delete the `NPM_TOKEN` repository secret. The workflows do not use it.

## Publish an existing tag

semantic-release creates the git tag before it publishes to npm. If the publish step fails,
the tag stays, and later runs treat that version as released. To publish such a tag:

1. Open **Actions → Publish → Run workflow** on `main`.
2. Enter the tag, for example `v1.1.3`.
3. Keep the dist-tag `latest` for the newest version. Use another dist-tag (for example
   `legacy`) for an older version or a prerelease; the job refuses to move `latest` back.

The job publishes the tagged sources through trusted publishing, then creates the GitHub
release if it does not exist. It skips versions that are already on npm.

## Troubleshooting

**`ENEEDAUTH`, `EOTP` or `401` during publish**: the trusted publisher settings on
npmjs.com do not match. Check the user, the repository and the workflow filename
(`publish.yml`).

## Verifying a release

```bash
npm view move-prop-types version
npm audit signatures   # in a project that depends on move-prop-types
```
