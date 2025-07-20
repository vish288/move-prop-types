import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'build/**',
        'test/**',
        '**/*.config.js',
        '**/*.config.ts',
      ],
    },
  },
});