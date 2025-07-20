import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { findMatch, installPackage, updateFile, updateFolder } from '../../src/helper.js';

// Mock dependencies
vi.mock('chalk', () => ({
  default: {
    cyan: { underline: { bold: vi.fn((text) => text) } },
    hex: vi.fn(() => ({ bold: vi.fn((text) => text) })),
    magenta: { italic: vi.fn((text) => text) },
    green: vi.fn((text) => text),
    red: { inverse: vi.fn((text) => text) },
    underline: { yellowBright: vi.fn((text) => text) },
    greenBright: vi.fn((text) => text),
    yellowBright: vi.fn((text) => text),
  },
}));

vi.mock('child_process', () => ({
  exec: vi.fn(),
}));

describe('helper.ts', () => {
  describe('findMatch', () => {
    it('should find matching value in array', () => {
      const givenValue = ['--path', 'test-file.js'];
      const setToMatch = ['--path', '-P'];
      expect(findMatch(givenValue, setToMatch)).toBe('test-file.js');
    });

    it('should return empty string if no match found', () => {
      const givenValue = ['--unknown', 'test-file.js'];
      const setToMatch = ['--path', '-P'];
      expect(findMatch(givenValue, setToMatch)).toBe('');
    });

    it('should return empty string for non-array input', () => {
      expect(findMatch('not-array', ['--path', '-P'])).toBe('');
    });

    it('should handle alternative short flags', () => {
      const givenValue = ['-P', 'test-file.js'];
      const setToMatch = ['--path', '-P'];
      expect(findMatch(givenValue, setToMatch)).toBe('test-file.js');
    });
  });

  describe('installPackage', () => {
    beforeEach(() => {
      vi.clearAllMocks();
      console.log = vi.fn();
      console.error = vi.fn();
    });

    it('should detect already installed prop-types', async () => {
      // Mock successful import
      vi.doMock('prop-types', () => ({}));
      
      await installPackage();
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('prop-types is already installed')
      );
    });
  });

  describe('updateFile', () => {
    const testDir = path.join(process.cwd(), 'test', 'fixtures');
    const testFile = path.join(testDir, 'test-component.js');

    beforeEach(async () => {
      vi.clearAllMocks();
      console.log = vi.fn();
      console.error = vi.fn();
      
      // Ensure test directory exists
      await fs.mkdir(testDir, { recursive: true });
    });

    afterEach(async () => {
      // Clean up test files
      try {
        await fs.unlink(testFile);
      } catch (e) {
        // File might not exist, ignore
      }
    });

    it('should process .js file with React.PropTypes', async () => {
      const content = `import React, { PropTypes } from 'react';
const MyComponent = () => <div>Hello</div>;
MyComponent.propTypes = {
  name: React.PropTypes.string
};`;

      await fs.writeFile(testFile, content);
      await updateFile('test', testFile);

      const updatedContent = await fs.readFile(testFile, 'utf-8');
      expect(updatedContent).toContain('import PropTypes from \'prop-types\';');
      expect(updatedContent).toContain('PropTypes.string');
      expect(updatedContent).not.toContain('React.PropTypes');
    });

    it('should skip files that are not .js or .jsx', async () => {
      const txtFile = path.join(testDir, 'test.txt');
      await fs.writeFile(txtFile, 'not a js file');
      
      await updateFile('test', txtFile);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('not a .js or .jsx file')
      );
      
      await fs.unlink(txtFile);
    });

    it('should handle non-existent file', async () => {
      await updateFile('test', 'non-existent-file');
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining("doesn't seem to exist")
      );
    });

    it('should handle file without extension', async () => {
      const jsFile = path.join(testDir, 'component.js');
      const content = `import React, { PropTypes } from 'react';`;
      
      await fs.writeFile(jsFile, content);
      await updateFile('test', path.join(testDir, 'component'));
      
      const updatedContent = await fs.readFile(jsFile, 'utf-8');
      expect(updatedContent).toContain('import PropTypes from \'prop-types\';');
      
      await fs.unlink(jsFile);
    });

    it('should not modify files that already have prop-types import', async () => {
      const content = `import React from 'react';
import PropTypes from 'prop-types';
const MyComponent = () => <div>Hello</div>;
MyComponent.propTypes = {
  name: PropTypes.string
};`;

      await fs.writeFile(testFile, content);
      const originalContent = content;
      
      await updateFile('test', testFile);
      
      const updatedContent = await fs.readFile(testFile, 'utf-8');
      expect(updatedContent).toBe(originalContent);
    });
  });

  describe('updateFolder', () => {
    const testDir = path.join(process.cwd(), 'test', 'fixtures', 'folder-test');
    const subDir = path.join(testDir, 'subdir');

    beforeEach(async () => {
      vi.clearAllMocks();
      console.log = vi.fn();
      console.error = vi.fn();
      
      // Create test directory structure
      await fs.mkdir(subDir, { recursive: true });
    });

    afterEach(async () => {
      // Clean up test directories
      try {
        await fs.rm(testDir, { recursive: true, force: true });
      } catch (e) {
        // Directory might not exist, ignore
      }
    });

    it('should process all .js files in folder recursively', async () => {
      const file1 = path.join(testDir, 'component1.js');
      const file2 = path.join(subDir, 'component2.jsx');
      
      const content = `import React, { PropTypes } from 'react';`;
      await fs.writeFile(file1, content);
      await fs.writeFile(file2, content);
      
      await updateFolder('test', testDir);
      
      const content1 = await fs.readFile(file1, 'utf-8');
      const content2 = await fs.readFile(file2, 'utf-8');
      
      expect(content1).toContain('import PropTypes from \'prop-types\';');
      expect(content2).toContain('import PropTypes from \'prop-types\';');
    });

    it('should handle empty folder', async () => {
      await updateFolder('test', testDir);
      
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('ready!')
      );
    });

    it('should handle non-existent folder', async () => {
      await updateFolder('test', 'non-existent-folder');
      
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('Error processing folder non-existent-folder:'),
        expect.any(String)
      );
    });
  });
});