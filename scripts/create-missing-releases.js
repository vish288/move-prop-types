#!/usr/bin/env node
/**
 * Script to create GitHub releases for existing git tags that don't have releases
 */

import { execSync } from 'child_process';

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Error executing: ${command}`);
    console.error(error.message);
    return '';
  }
}

function createRelease(tag) {
  console.log(`Creating release for ${tag}...`);
  
  // Get commit date for the tag
  const commitDate = exec(`git log -1 --format=%ai ${tag}`);
  const shortDate = commitDate.split(' ')[0];
  
  // Create a simple release note
  const releaseNotes = `Release ${tag} from ${shortDate}

This is a historical release created to maintain version continuity. 

For the latest features and TypeScript support, please use v1.0.0 or newer.`;

  try {
    const result = exec(`gh release create ${tag} --title "${tag}" --notes "${releaseNotes}"`);
    console.log(`✅ Created release for ${tag}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create release for ${tag}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🔍 Finding tags without GitHub releases...\n');
  
  // Get all local tags
  const allTags = exec('git tag -l').split('\n').filter(Boolean);
  const versionTags = allTags.filter(tag => /^v\d/.test(tag)).sort((a, b) => {
    // Basic version sorting
    const aVersion = a.replace('v', '');
    const bVersion = b.replace('v', '');
    return aVersion.localeCompare(bVersion, undefined, { numeric: true });
  });
  
  // Get existing GitHub releases
  const existingReleases = exec('gh api repos/vish288/move-prop-types/releases --jq ".[].tag_name"').split('\n').filter(Boolean);
  
  // Find missing releases
  const missingReleases = versionTags.filter(tag => !existingReleases.includes(tag));
  
  console.log(`Found ${missingReleases.length} tags without GitHub releases:`);
  console.log(missingReleases.join(', '));
  console.log('');
  
  if (missingReleases.length === 0) {
    console.log('✅ All tags already have GitHub releases!');
    return;
  }
  
  // Create releases for missing tags
  let successCount = 0;
  let failureCount = 0;
  
  for (const tag of missingReleases) {
    if (createRelease(tag)) {
      successCount++;
    } else {
      failureCount++;
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  
  if (failureCount > 0) {
    console.log('\n⚠️  Some releases failed to create. You may need to check GitHub API rate limits or permissions.');
  } else {
    console.log('\n🎉 All missing releases created successfully!');
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error.message);
  process.exit(1);
});