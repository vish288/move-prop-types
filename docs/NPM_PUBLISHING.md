# npm Publishing

Releases are fully automated. Every push to `main` runs the **Release and Publish**
workflow (`.github/workflows/release.yml`), where
[semantic-release](https://github.com/semantic-release/semantic-release) decides the
next version from the commit messages, publishes to npm, tags the commit and creates
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
   - Workflow filename: `release.yml`
   - Environment: _(leave empty)_
3. Save. Optionally set **Publishing access** to
   _"Require two-factor authentication and disallow tokens"_ so only the trusted
   publisher can publish.
4. Delete the `NPM_TOKEN` repository secret once a release has succeeded.

### Fallback: granular access token

If trusted publishing is not configured, the release job falls back to the
`NPM_TOKEN` repository secret. Use a
[granular access token](https://docs.npmjs.com/creating-and-viewing-access-tokens)
scoped to this package with read and write access, and keep its expiry short.

## Troubleshooting

**`EINVALIDNPMTOKEN` / `401 Unauthorized`**: no trusted publisher is configured and
`NPM_TOKEN` is missing, expired or revoked. Configure trusted publishing (preferred)
or replace the secret, then re-run the failed workflow run.

**`ENEEDAUTH` from the OIDC exchange**: check that the trusted publisher settings
match the repository and the workflow filename exactly.

## Verifying a release

```bash
npm view move-prop-types version
npm audit signatures   # in a project that depends on move-prop-types
```
