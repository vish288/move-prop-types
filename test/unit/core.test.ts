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
    const { createCommand } = await import('../../src/core.js');
    const command = createCommand();
    expect(command).toBeInstanceOf(Command);
  });

  it('should have correct command name and alias', async () => {
    const { createCommand } = await import('../../src/core.js');
    const command = createCommand();
    expect(command.name()).toBe('move-prop-types');
    expect(command.alias()).toBe('mpt');
  });

  it('should have all required options', async () => {
    const { createCommand } = await import('../../src/core.js');
    const command = createCommand();
    const options = command.options;
    
    const optionFlags = options.map(opt => opt.flags);
    expect(optionFlags).toContain('-I, --install');
    expect(optionFlags).toContain('-P, --path <path>');
    expect(optionFlags).toContain('-F, --folder <folder>');
  });

  it('should have help text configured', async () => {
    const { createCommand } = await import('../../src/core.js');
    const command = createCommand();
    // Check if the command has help text by checking the helpInformation
    const helpText = command.helpInformation();
    expect(helpText).toContain('move-prop-types');
    expect(helpText).toContain('Usage:');
    expect(helpText).toContain('Options:');
  });

  it('should set cli property to true', async () => {
    const { createCommand } = await import('../../src/core.js');
    const command = createCommand();
    expect((command as any).cli).toBe(true);
  });
});