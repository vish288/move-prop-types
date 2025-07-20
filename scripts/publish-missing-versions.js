#!/usr/bin/env node
/**
 * Script to publish all GitHub releases that are missing from npm
 * This script will be used once NPM_TOKEN is configured to catch up
 * on all unpublished versions.
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

/**
 * Execute command and return output
 */
function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Error executing: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

/**
 * Get all GitHub release versions
 */
function getGitHubReleases() {
  try {
    const releases = exec('gh api repos/vish288/move-prop-types/releases --jq ".[].tag_name"');
    return releases.split('\n').filter(Boolean).map(tag => tag.replace(/^v/, ''));
  } catch (error) {
    console.error('Failed to fetch GitHub releases:', error.message);
    return [];
  }
}

/**
 * Get all published npm versions
 */
function getNpmVersions() {
  try {
    const output = exec('npm view move-prop-types versions --json');
    return JSON.parse(output);
  } catch (error) {
    console.warn('Failed to fetch npm versions (package might not exist):', error.message);
    return [];
  }
}

/**
 * Check if npm is authenticated
 */
function checkNpmAuth() {
  try {
    exec('npm whoami');
    return true;
  } catch (error) {
    console.error('❌ NPM authentication failed. Please ensure NPM_TOKEN is configured.');
    return false;
  }
}

/**
 * Publish a specific version by checking out the tag and building
 */
function publishVersion(version) {
  console.log(`📦 Publishing version ${version}...`);
  
  try {
    // Checkout the specific tag
    exec(`git checkout v${version}`);
    
    // Install dependencies
    console.log('  Installing dependencies...');
    exec('pnpm install --frozen-lockfile');
    
    // Build the package
    console.log('  Building package...');
    exec('pnpm run build');
    
    // Publish to npm
    console.log('  Publishing to npm...');
    exec('npm publish --access public');
    
    console.log(`✅ Successfully published ${version}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to publish ${version}:`, error.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔍 Checking for unpublished versions...\n');
  
  // Check npm authentication
  if (!checkNpmAuth()) {
    process.exit(1);
  }
  
  // Get current branch to restore later
  const currentBranch = exec('git branch --show-current');
  
  try {
    // Get GitHub releases and npm versions
    const githubReleases = getGitHubReleases();
    const npmVersions = getNpmVersions();
    
    console.log('GitHub releases:', githubReleases);
    console.log('NPM versions:', npmVersions.slice(-5), '(last 5)');
    console.log('');
    
    // Find missing versions
    const missingVersions = githubReleases.filter(version => !npmVersions.includes(version));
    
    if (missingVersions.length === 0) {
      console.log('✅ All GitHub releases are already published to npm!');
      return;
    }
    
    console.log(`📋 Found ${missingVersions.length} unpublished version(s):`, missingVersions);
    console.log('');
    
    // Sort versions to publish in order
    const sortedMissing = missingVersions.sort((a, b) => {
      // Basic semver sorting
      const aParts = a.split('.').map(p => parseInt(p.split('-')[0]));
      const bParts = b.split('.').map(p => parseInt(p.split('-')[0]));
      
      for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
        const aPart = aParts[i] || 0;
        const bPart = bParts[i] || 0;
        if (aPart !== bPart) return aPart - bPart;
      }
      
      // Handle pre-release versions (beta, alpha, etc.)
      if (a.includes('-') && !b.includes('-')) return -1;
      if (!a.includes('-') && b.includes('-')) return 1;
      return a.localeCompare(b);
    });
    
    console.log(`📤 Publishing versions in order: ${sortedMissing.join(', ')}\n`);
    
    let successCount = 0;
    let failureCount = 0;
    
    // Publish each missing version
    for (const version of sortedMissing) {
      if (publishVersion(version)) {
        successCount++;
      } else {
        failureCount++;
      }
      console.log('');
    }
    
    // Summary
    console.log('📊 Publication Summary:');
    console.log(`  ✅ Successful: ${successCount}`);
    console.log(`  ❌ Failed: ${failureCount}`);
    
    if (failureCount > 0) {
      console.log('\n⚠️  Some versions failed to publish. Check the logs above for details.');
      process.exit(1);
    } else {
      console.log('\n🎉 All missing versions published successfully!');
    }
    
  } finally {
    // Restore original branch
    try {
      exec(`git checkout ${currentBranch}`);
      console.log(`\n🔄 Restored to branch: ${currentBranch}`);
    } catch (error) {
      console.warn(`⚠️  Could not restore to branch ${currentBranch}:`, error.message);
    }
  }
}

// Handle CLI arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📦 NPM Missing Versions Publisher

This script finds all GitHub releases that aren't published to npm and publishes them.

Usage:
  node scripts/publish-missing-versions.js [options]

Options:
  --help, -h     Show this help message
  --dry-run      Show what would be published without actually publishing

Environment Variables:
  NPM_TOKEN      Required for authentication with npm registry

Examples:
  node scripts/publish-missing-versions.js
  node scripts/publish-missing-versions.js --dry-run

Note: This script requires:
- git command available
- gh (GitHub CLI) command available  
- npm command available
- pnpm command available
- NPM_TOKEN environment variable set
`);
  process.exit(0);
}

if (process.argv.includes('--dry-run')) {
  console.log('🏃 DRY RUN MODE - No actual publishing will occur\n');
  
  const githubReleases = getGitHubReleases();
  const npmVersions = getNpmVersions();
  const missingVersions = githubReleases.filter(version => !npmVersions.includes(version));
  
  console.log('GitHub releases:', githubReleases);
  console.log('NPM versions:', npmVersions.slice(-5), '(last 5)');
  console.log('Missing versions that would be published:', missingVersions);
  
  process.exit(0);
}

// Run the main function
main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});