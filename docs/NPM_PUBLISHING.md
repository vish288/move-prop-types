# NPM Publishing Setup

This document explains how to configure NPM publishing for the move-prop-types repository and how to publish missing versions.

## Quick Setup

### 1. Configure NPM_TOKEN

1. **Create NPM Access Token**:
   - Go to [npmjs.com](https://npmjs.com) and sign in
   - Navigate to Account Settings → Access Tokens
   - Click "Generate New Token"
   - Select "Automation" token type
   - Set permissions to include publishing
   - Copy the generated token

2. **Add GitHub Secret**:
   - Go to repository Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: (paste the token from step 1)
   - Click "Add secret"

### 2. Automatic Publishing

Once `NPM_TOKEN` is configured:

- ✅ **Future releases**: Automatically published via semantic-release
- ✅ **Missing versions**: Automatically detected and published

## Missing Versions Publisher

### Current Status

**Unpublished versions that will be published once NPM_TOKEN is set:**
- `v0.20.1-beta.1` (TypeScript support beta)
- `v1.0.0` (stable release with TypeScript support)

### Manual Publishing

You can manually trigger publishing of missing versions:

```bash
# Check what would be published (dry run)
npm run publish:missing:dry

# Actually publish missing versions (requires NPM_TOKEN)
npm run publish:missing
```

### GitHub Actions

The repository includes automated workflows:

1. **Manual Trigger**: Go to Actions → "Publish Missing Versions" → "Run workflow"
2. **Scheduled Check**: Runs daily at 6 AM UTC to detect and publish missing versions
3. **Automatic**: Runs when NPM_TOKEN is first configured

## How It Works

### Detection Logic

The system compares GitHub releases with published npm versions:

1. **Fetches GitHub releases** using GitHub CLI (`gh api`)
2. **Fetches npm versions** using `npm view`
3. **Identifies missing versions** by comparing the two lists
4. **Publishes in order** from oldest to newest

### Publishing Process

For each missing version:

1. **Checkout the tag** (`git checkout v{version}`)
2. **Install dependencies** (`pnpm install --frozen-lockfile`)
3. **Build the package** (`pnpm run build`)
4. **Publish to npm** (`npm publish --access public`)

### Safety Features

- ✅ **Dry run mode** to preview what would be published
- ✅ **Authentication check** before attempting to publish
- ✅ **Automatic cleanup** restores original git branch
- ✅ **Error handling** continues with other versions on failure
- ✅ **Issue creation** on failure for manual intervention

## Commands Reference

### NPM Scripts

```bash
# Publishing missing versions
npm run publish:missing:dry    # Dry run - show what would be published
npm run publish:missing        # Actually publish missing versions

# Development
npm run build                  # Build the package
npm run test:ci               # Run tests
npm run lint:check            # Check linting

# Monitoring
npm run monitor:latest        # Check latest workflow status
npm run monitor:watch         # Watch workflows in real-time
```

### GitHub CLI Commands

```bash
# Trigger manual publishing workflow
gh workflow run publish-missing.yml

# Check workflow status
gh run list --workflow=publish-missing.yml

# View latest workflow logs
gh run view --log
```

## Troubleshooting

### NPM Authentication Issues

**Error**: `ENEEDAUTH` or `Invalid npm token`

**Solutions**:
1. Verify NPM_TOKEN is correctly set in GitHub secrets
2. Ensure token has publishing permissions
3. Check if 2FA is set to "Authorization only" (not "Authorization and writes")

### Publishing Failures

**Error**: Version already exists

**Cause**: Version was published outside of this system

**Solution**: This is normal - the script will skip existing versions

**Error**: Build failures

**Cause**: Dependencies or build process changed between versions

**Solution**: Check the specific version's requirements and dependencies

### Git Issues

**Error**: Cannot checkout tag

**Cause**: Local git state conflicts

**Solution**: 
```bash
git stash                    # Save local changes
git checkout main            # Return to main branch
npm run publish:missing      # Try again
```

## Monitoring

### GitHub Actions

- View workflows: Repository → Actions tab
- Check "Publish Missing Versions" workflow runs
- Review logs for detailed publishing information

### NPM Registry

```bash
# Check latest published version
npm view move-prop-types version

# Check all published versions
npm view move-prop-types versions --json

# Verify specific version exists
npm view move-prop-types@1.0.0
```

## Security Considerations

- ✅ NPM_TOKEN is stored securely in GitHub secrets
- ✅ Only repository maintainers can configure secrets
- ✅ Publishing requires authentication
- ✅ All actions are logged and auditable
- ✅ Workflow runs in isolated GitHub Actions environment

## Support

If you encounter issues:

1. **Check workflow logs** in GitHub Actions
2. **Review error messages** in the script output
3. **Verify NPM_TOKEN** is correctly configured
4. **Open an issue** if problems persist

The system is designed to be robust and will create GitHub issues automatically if publishing fails.