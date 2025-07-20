#!/usr/bin/env node

/**
 * GitHub Workflow Monitoring Script
 * 
 * Provides real-time monitoring of GitHub Actions workflows with:
 * - Colored status indicators
 * - Real-time progress tracking
 * - Auto-refresh until completion
 * - Clear success/failure reporting
 */

import { execSync } from 'child_process';
import { exit } from 'process';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

// Status mapping
const statusColors = {
  'completed': { color: colors.green, symbol: '✓' },
  'success': { color: colors.green, symbol: '✓' },
  'failure': { color: colors.red, symbol: '✗' },
  'cancelled': { color: colors.yellow, symbol: '⚠' },
  'in_progress': { color: colors.blue, symbol: '⚡' },
  'queued': { color: colors.cyan, symbol: '⏳' },
  'pending': { color: colors.cyan, symbol: '⏳' },
  'waiting': { color: colors.cyan, symbol: '⏳' },
  'requested': { color: colors.cyan, symbol: '⏳' }
};

// Configuration
const config = {
  refreshInterval: 10000, // 10 seconds
  maxRetries: 3,
  watchMode: process.argv.includes('--watch'),
  latestOnly: process.argv.includes('--latest'),
  verbose: process.argv.includes('--verbose'),
  triggerWorkflow: process.argv.includes('--trigger')
};

class WorkflowMonitor {
  constructor() {
    this.isRunning = true;
    this.retryCount = 0;
    this.lastUpdateTime = null;
    
    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
      console.log(`\n${colors.yellow}Monitoring stopped by user${colors.reset}`);
      exit(0);
    });
  }

  /**
   * Execute shell command with error handling
   */
  execCommand(command, suppressErrors = false) {
    try {
      const result = execSync(command, { 
        encoding: 'utf8',
        stdio: suppressErrors ? ['pipe', 'pipe', 'pipe'] : ['pipe', 'pipe', 'inherit']
      });
      this.retryCount = 0; // Reset retry count on success
      return result.trim();
    } catch (error) {
      if (!suppressErrors) {
        console.error(`${colors.red}Command failed: ${command}${colors.reset}`);
        console.error(`${colors.gray}${error.message}${colors.reset}`);
      }
      throw error;
    }
  }

  /**
   * Get current branch name
   */
  getCurrentBranch() {
    try {
      return this.execCommand('git branch --show-current', true);
    } catch {
      return 'main';
    }
  }

  /**
   * Trigger a new workflow run
   */
  async triggerWorkflow() {
    try {
      console.log(`${colors.cyan}Triggering new workflow run...${colors.reset}`);
      
      // Create an empty commit to trigger workflow
      const branch = this.getCurrentBranch();
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      
      // Check if there are any changes to commit first
      const status = this.execCommand('git status --porcelain', true);
      
      if (status.trim()) {
        console.log(`${colors.yellow}Committing local changes first...${colors.reset}`);
        this.execCommand('git add .');
        this.execCommand(`git commit -m "chore: update configuration and trigger CI

Local changes committed to trigger fresh workflow run."`);
      } else {
        // Create empty commit to trigger workflow
        this.execCommand(`git commit --allow-empty -m "ci: trigger workflow run - ${timestamp}

Fresh workflow run triggered from local monitoring script."`);
      }
      
      // Push to remote
      console.log(`${colors.cyan}Pushing to origin/${branch}...${colors.reset}`);
      this.execCommand(`git push origin ${branch}`);
      
      console.log(`${colors.green}✓ Workflow triggered successfully!${colors.reset}`);
      console.log(`${colors.gray}New workflow should appear in ~30 seconds...${colors.reset}`);
      
      return true;
    } catch (error) {
      console.error(`${colors.red}Failed to trigger workflow: ${error.message}${colors.reset}`);
      return false;
    }
  }

  /**
   * Fetch workflow runs from GitHub
   */
  async fetchWorkflowRuns() {
    try {
      const branch = this.getCurrentBranch();
      const limit = config.latestOnly ? 1 : 5;
      const command = `gh run list --branch "${branch}" --limit ${limit} --json databaseId,status,conclusion,name,createdAt,updatedAt,url,displayTitle`;
      
      const output = this.execCommand(command, true);
      return JSON.parse(output);
    } catch (error) {
      if (this.retryCount < config.maxRetries) {
        this.retryCount++;
        console.log(`${colors.yellow}Retrying... (${this.retryCount}/${config.maxRetries})${colors.reset}`);
        await this.sleep(2000);
        return this.fetchWorkflowRuns();
      }
      throw error;
    }
  }

  /**
   * Get detailed workflow information
   */
  async getWorkflowDetails(runId) {
    try {
      const command = `gh run view ${runId} --json jobs,status,conclusion,name,url`;
      const output = this.execCommand(command, true);
      return JSON.parse(output);
    } catch (error) {
      if (config.verbose) {
        console.error(`${colors.gray}Could not fetch details for run ${runId}${colors.reset}`);
      }
      return null;
    }
  }

  /**
   * Format status with color and symbol
   */
  formatStatus(status, conclusion) {
    const effectiveStatus = conclusion || status;
    const statusInfo = statusColors[effectiveStatus] || { color: colors.gray, symbol: '?' };
    return `${statusInfo.color}${statusInfo.symbol} ${effectiveStatus.toUpperCase()}${colors.reset}`;
  }

  /**
   * Format duration
   */
  formatDuration(startTime, endTime) {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const duration = Math.floor((end - start) / 1000);
    
    if (duration < 60) return `${duration}s`;
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`;
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`;
  }

  /**
   * Display workflow status
   */
  async displayWorkflows(runs) {
    // Clear screen and show header
    console.clear();
    console.log(`${colors.bright}${colors.cyan}🔍 GitHub Workflow Monitor${colors.reset}`);
    console.log(`${colors.gray}Branch: ${this.getCurrentBranch()} | Updated: ${new Date().toLocaleTimeString()}${colors.reset}`);
    console.log('─'.repeat(80));

    if (runs.length === 0) {
      console.log(`${colors.yellow}No recent workflow runs found${colors.reset}`);
      return { allComplete: true, anyFailed: false };
    }

    let allComplete = true;
    let anyFailed = false;

    for (const run of runs) {
      const status = this.formatStatus(run.status, run.conclusion);
      const duration = this.formatDuration(run.createdAt, run.updatedAt);
      const isRunning = run.status === 'in_progress' || run.status === 'queued';
      
      if (isRunning) allComplete = false;
      if (run.conclusion === 'failure') anyFailed = true;

      console.log(`\n${colors.bright}${run.name}${colors.reset}`);
      console.log(`  Status: ${status} | Duration: ${colors.gray}${duration}${colors.reset}`);
      console.log(`  Title: ${colors.gray}${run.displayTitle}${colors.reset}`);
      
      if (config.verbose || isRunning) {
        const details = await this.getWorkflowDetails(run.databaseId);
        if (details && details.jobs) {
          console.log(`  Jobs:`);
          for (const job of details.jobs) {
            const jobStatus = this.formatStatus(job.status, job.conclusion);
            console.log(`    • ${job.name}: ${jobStatus}`);
          }
        }
      }
      
      if (run.conclusion === 'failure') {
        console.log(`  ${colors.red}View logs: ${run.url}${colors.reset}`);
      }
    }

    console.log('\n' + '─'.repeat(80));
    
    // Summary
    const runningCount = runs.filter(r => r.status === 'in_progress' || r.status === 'queued').length;
    const failedCount = runs.filter(r => r.conclusion === 'failure').length;
    const successCount = runs.filter(r => r.conclusion === 'success').length;

    if (runningCount > 0) {
      console.log(`${colors.blue}⚡ ${runningCount} workflow(s) running...${colors.reset}`);
    }
    if (failedCount > 0) {
      console.log(`${colors.red}✗ ${failedCount} workflow(s) failed${colors.reset}`);
    }
    if (successCount > 0) {
      console.log(`${colors.green}✓ ${successCount} workflow(s) succeeded${colors.reset}`);
    }

    return { allComplete, anyFailed };
  }

  /**
   * Sleep for specified milliseconds
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Main monitoring loop
   */
  async monitor() {
    console.log(`${colors.cyan}Starting GitHub workflow monitoring...${colors.reset}`);
    
    try {
      // Verify gh CLI is available
      this.execCommand('gh --version', true);
    } catch {
      console.error(`${colors.red}Error: GitHub CLI (gh) is not installed or not authenticated${colors.reset}`);
      console.error(`${colors.gray}Please install gh CLI and run 'gh auth login'${colors.reset}`);
      exit(1);
    }

    // If trigger flag is set, trigger a new workflow run first
    if (config.triggerWorkflow) {
      const triggered = await this.triggerWorkflow();
      if (!triggered) {
        console.error(`${colors.red}Failed to trigger workflow. Exiting.${colors.reset}`);
        exit(1);
      }
      // Wait a bit for the workflow to appear
      console.log(`${colors.gray}Waiting for workflow to appear...${colors.reset}`);
      await this.sleep(10000);
    }

    while (this.isRunning) {
      try {
        const runs = await this.fetchWorkflowRuns();
        const { allComplete, anyFailed } = await this.displayWorkflows(runs);

        if (!config.watchMode && allComplete) {
          console.log(`\n${colors.green}${colors.bright}All workflows completed!${colors.reset}`);
          exit(anyFailed ? 1 : 0);
        }

        if (!config.watchMode && !allComplete) {
          console.log(`\n${colors.yellow}Some workflows are still running. Use --watch to monitor continuously.${colors.reset}`);
          exit(0);
        }

        // Wait before next update
        if (config.watchMode || !allComplete) {
          console.log(`\n${colors.gray}Refreshing in ${config.refreshInterval / 1000} seconds... (Press Ctrl+C to stop)${colors.reset}`);
          await this.sleep(config.refreshInterval);
        }

      } catch (error) {
        console.error(`\n${colors.red}Error monitoring workflows: ${error.message}${colors.reset}`);
        if (this.retryCount >= config.maxRetries) {
          exit(1);
        }
        await this.sleep(5000);
      }
    }
  }
}

// Show usage help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
${colors.bright}GitHub Workflow Monitor${colors.reset}

${colors.cyan}Usage:${colors.reset}
  node scripts/monitor-workflows.js [options]

${colors.cyan}Options:${colors.reset}
  --watch        Monitor continuously until stopped
  --latest       Monitor only the latest workflow run
  --verbose      Show detailed job information
  --trigger      Trigger a new workflow run before monitoring
  --help, -h     Show this help message

${colors.cyan}Examples:${colors.reset}
  npm run monitor                    # Check current status
  npm run monitor:watch             # Monitor continuously
  npm run monitor:latest            # Monitor latest run only
  node scripts/monitor-workflows.js --trigger  # Trigger new workflow run

${colors.cyan}Exit Codes:${colors.reset}
  0 - All workflows succeeded
  1 - Some workflows failed or error occurred
`);
  exit(0);
}

// Start monitoring
const monitor = new WorkflowMonitor();
monitor.monitor().catch(error => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  exit(1);
});