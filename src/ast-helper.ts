/**
 * AST-based helper functions for PropTypes transformation
 * This is an alternative to the regex-based helper.ts with better accuracy and reliability
 */

import chalk from 'chalk';
import { stdout } from 'process';
import { lstatSync, readdir, readFile, writeFile } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { transformWithAST, needsTransformation } from './ast-transformer.js';
import { fileEncoding } from './constants.js';

import type {
  FindMatchFunction,
  InstallPackageFunction,
  UpdateFileFunction,
  UpdateFolderFunction,
  HelpExamplesFunction,
} from './types.js';

const execAsync = promisify(exec);
const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);
const readdirAsync = promisify(readdir);

/**
 * Install prop-types package (same as original)
 */
export const installPackage: InstallPackageFunction = async (): Promise<void> => {
  console.log('');
  try {
    // Check if the package is installed in the project
    await import('prop-types');
    console.log(`${chalk.cyan.underline.bold('prop-types')} is already installed in your project`);
  } catch {
    console.log('Installing prop-types to your project');
    try {
      const { stdout: installOutput, stderr } = await execAsync('pnpm add prop-types');
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        console.log('');
        return;
      }
      // the *entire* stdout (buffered)
      console.log(`${chalk.hex('#FF6347').bold('Installation underway')}`);
      console.log(installOutput);
      console.log(`${chalk.cyan.underline.bold('prop-types')} is now installed`);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error installing prop-types:', errorMessage);
    }
  }
};

/**
 * Write file with AST-based PropTypes conversion
 */
const writeFileAsyncAST = async (fileAndPath: string): Promise<void> => {
  try {
    const data = await readFileAsync(fileAndPath, fileEncoding);
    const dataString = data.toString();

    // Use AST to check if transformation is needed
    if (!needsTransformation(dataString, fileAndPath)) {
      return;
    }

    // Transform using AST
    const result = transformWithAST(dataString, fileAndPath);

    if (result.modified && result.code) {
      await writeFileAsync(fileAndPath, result.code, fileEncoding);
      console.log(`${chalk.magenta.italic(fileAndPath)} just got ${chalk.green('updated')} with AST!`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing file ${fileAndPath}:`, errorMessage);
  }
};

/**
 * Update a single file using AST transformation
 */
export const updateFile: UpdateFileFunction = async (
  cmd: string,
  fileAndPath: string
): Promise<void> => {
  if (!fileAndPath) {
    console.error('No file path provided');
    return;
  }

  let targetPath = fileAndPath;

  // Handle file extension validation
  if (/[.]/.exec(targetPath)) {
    if (!/\S+\.(jsx?|tsx?)$/.test(targetPath)) {
      console.log(`Skipping ${targetPath} - not a .js, .jsx, .ts, or .tsx file`);
      return;
    }
  } else {
    // Try to find the file with .js, .jsx, .ts, or .tsx extension
    const fs = await import('fs');
    const statAsync = promisify(fs.stat);
    const extensions = ['.js', '.jsx', '.ts', '.tsx'];
    let found = false;
    
    for (const ext of extensions) {
      try {
        await statAsync(`${targetPath}${ext}`);
        targetPath = `${targetPath}${ext}`;
        found = true;
        break;
      } catch (err) {
        // Continue to next extension
      }
    }
    
    if (!found) {
      console.log(
        `${chalk.magenta.italic(targetPath)} doesn't ${chalk.red.inverse(
          'seem to exist in the given path'
        )} with extensions .js, .jsx, .ts, or .tsx`
      );
      return;
    }
  }

  await writeFileAsyncAST(targetPath);
};

/**
 * Update all files in a folder recursively using AST transformation
 */
export const updateFolder: UpdateFolderFunction = async (
  cmd: string,
  folderName: string
): Promise<void> => {
  console.log('');
  try {
    const files = await readdirAsync(folderName);

    const folderInFolder = files.filter((source) =>
      lstatSync(`${folderName}/${source}`).isDirectory()
    );

    // Process subdirectories recursively
    for (const folder of folderInFolder) {
      await updateFolder('updateFolder', `${folderName}/${folder}`);
    }

    const filesInFolder = files.filter(
      (source) => !lstatSync(`${folderName}/${source}`).isDirectory()
    );

    // Process files in current directory (filter for supported file types)
    const supportedFiles = filesInFolder.filter(file => 
      /\.(jsx?|tsx?)$/.test(file)
    );
    
    for (const file of supportedFiles) {
      await updateFile('updateFolder', `${folderName}/${file}`);
    }

    console.log('');
    console.log(
      `folder ${chalk.underline.yellowBright(folderName)} and js/jsx/ts/tsx files inside are now ${chalk.greenBright(
        'ready'
      )} with AST!`
    );
    stdout.write('\\x1b[2J');
    stdout.write('\\x1b[0f');
    console.log(
      `Your folder and files have been updated with AST transformation. Thank you for using ${chalk.yellowBright(
        'move-prop-types'
      )}`
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing folder ${folderName}:`, errorMessage);
  }
};

/**
 * Display help examples (same as original)
 */
export const helpExamples: HelpExamplesFunction = (): string => {
  return `
  Examples (AST-based transformation):
    $ move-prop-types --help for info
    $ move-prop-types -P ../dir1/dir2/filename.[js|jsx|ts|tsx] - This will run AST-based replace only on the given file.
    $ move-prop-types -F ../dir1/dir2 - This will run the AST-based update for all the files inside the given directory
    $ move-prop-types -I -F ../dir1/dir2 - This will install prop-types to dependencies and run the AST-based update for all the files inside the given directory
`;
};

/**
 * Find matching value in array (same as original)
 */
export const findMatch: FindMatchFunction = (
  givenValue: string[],
  setToMatch: string[]
): string => {
  if (!Array.isArray(givenValue)) {
    return '';
  }

  let index = 0;
  givenValue.filter((val) => {
    if (val === setToMatch[0] || val === setToMatch[1]) {
      index = givenValue.indexOf(val) + 1;
    }
  });

  return index && index < givenValue.length ? givenValue[index] || '' : '';
};