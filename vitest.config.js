import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    target: 'node18'
  },
  test: {
    environment: 'node',
    // Prevent hanging by setting proper timeouts and pool configuration
    testTimeout: 30000,
    hookTimeout: 30000,
    teardownTimeout: 10000,
    // Use threads pool with finite parallelism to prevent hanging
    pool: 'threads',
    poolOptions: {
      threads: {
        minThreads: 1,
        maxThreads: 4,
        useAtomics: true
      }
    },
    // Ensure tests exit cleanly
    watch: false, // Disable watch mode in CI
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'build/**',
        'test/**',
        'verify/**',
        '**/*.config.js',
        '**/*.config.ts',
        '**/*.d.ts',
      ],
    },
  },
});