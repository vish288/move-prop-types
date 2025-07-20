#!/usr/bin/env node

/**
 * CLI entry point for move-prop-types
 */
import { runCLI } from './core.js';

// Run the CLI when this file is executed directly
runCLI().catch((error) => {
  console.error('CLI Error:', error);
  process.exit(1);
});