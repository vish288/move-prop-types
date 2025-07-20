import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Command } from 'commander';

// Mock the helper functions
vi.mock('../../src/helper.js', () => ({
  findMatch: vi.fn((argv, flags) => {
    if (flags.includes('--path') && argv.includes('test-file.js')) return 'test-file.js';
    if (flags.includes('--folder') && argv.includes('test-folder')) return 'test-folder';
    return '';
  }),
  helpExamples: vi.fn(() => 'Help examples'),
  installPackage: vi.fn(),
  updateFile: vi.fn(),
  updateFolder: vi.fn(),
}));

describe('core.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset process.argv
    process.argv = ['node', 'test'];
  });

  it('should create a Command instance', async () => {
    const core = await import('../../build/core.js');
    expect(core.default).toBeInstanceOf(Command);
  });

  it('should have correct command name and alias', async () => {
    const core = await import('../../build/core.js');
    expect(core.default.name()).toBe('move-prop-types');
    expect(core.default.alias()).toBe('mpt');
  });

  it('should have all required options', async () => {
    const core = await import('../../build/core.js');
    const options = core.default.options;
    
    const optionFlags = options.map(opt => opt.flags);
    expect(optionFlags).toContain('-I, --install');
    expect(optionFlags).toContain('-P, --path <path>');
    expect(optionFlags).toContain('-F, --folder <folder>');
  });

  it('should have help text configured', async () => {
    const core = await import('../../build/core.js');
    // The help text should be added via addHelpText
    expect(core.default._helpText).toBeDefined();
  });

  it('should set cli property to true', async () => {
    const core = await import('../../build/core.js');
    expect(core.default.cli).toBe(true);
  });
});