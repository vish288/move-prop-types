/**
 * Module dependencies
 */
import chalk from 'chalk';
import { stdout } from 'process';
import { lstatSync, readdir, readFile, writeFile } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

import {
  es6PropTypeJust,
  es6PropTypeLeft,
  es6PropTypeRight,
  fileEncoding,
  importState,
  reactProto,
} from './constants.js';

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
 * Install prop-types package
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
 * Write file with ES6 prop-types conversion
 */
const writeFileAsyncEs6 = async (fileAndPath: string): Promise<void> => {
  try {
    const data = await readFileAsync(fileAndPath, fileEncoding);
    const dataString = data.toString();
    const isPropTypeUsed =
      es6PropTypeJust.test(dataString) || es6PropTypeLeft.test(dataString) || es6PropTypeRight.test(dataString);
    const isPropTypeAlreadyPresent = dataString.indexOf(importState) !== -1;

    if (!isPropTypeUsed || isPropTypeAlreadyPresent) {
      return;
    }

    let newData = dataString.replace(es6PropTypeJust, '');
    newData = newData.replace(es6PropTypeLeft, '');
    newData = newData.replace(es6PropTypeRight, ' }');
    
    // Clean up any double spaces in imports
    newData = newData.replace(/import React, \{\s+([^}]+)\s+\}/g, 'import React, { $1 }');
    newData = newData.replace(/,\s+,/g, ',');
    newData = newData.replace(/,\s+}/g, ' }');
    
    newData = newData.replace(reactProto, 'PropTypes.');
    
    // Find a good place to insert the import - after the first import or at the beginning
    const importRegex = /(import.*?['"].*?['"];?\n)/;
    const match = newData.match(importRegex);
    
    if (match) {
      const insertPosition = newData.indexOf(match[0]) + match[0].length;
      newData = newData.slice(0, insertPosition) + importState + newData.slice(insertPosition);
    } else {
      newData = `${importState}\n${newData}`;
    }

    if (newData) {
      await writeFileAsync(fileAndPath, newData, fileEncoding);
      console.log(`${chalk.magenta.italic(fileAndPath)} just got ${chalk.green('updated')}!`);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing file ${fileAndPath}:`, errorMessage);
  }
};

/**
 * Write file with ES5 prop-types conversion (legacy support)
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
const writeFileAsyncEs5 = async (fileAndPath: string): Promise<void> => {
  try {
    const data = await readFileAsync(fileAndPath, fileEncoding);
    const dataString = data.toString();
    let newData = dataString.replace(/React\.PropTypes[.]?/g, 'PropTypes.');
    newData = newData.replace(/const PropTypes = require\('react'\)\.PropTypes;$/g, '');
    newData = newData.replace(/{PropTypes} = require\('react'\)\.PropTypes/g, '');
    newData = [
      newData.slice(0, newData.indexOf("';\n") + 2),
      importState,
      newData.slice(newData.indexOf("';\n") + 2),
    ].join('');

    if (newData) {
      await writeFileAsync(fileAndPath, newData, fileEncoding);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing file ${fileAndPath}:`, errorMessage);
  }
};

/**
 * Update a single file
 */
export const updateFile: UpdateFileFunction = async (cmd: string, fileAndPath: string): Promise<void> => {
  if (!fileAndPath) {
    console.error('No file path provided');
    return;
  }

  let targetPath = fileAndPath;

  // Handle file extension validation
  if (/[.]/.exec(targetPath)) {
    if (!/\S+\.jsx?$/.test(targetPath)) {
      console.log(`Skipping ${targetPath} - not a .js or .jsx file`);
      return;
    }
  } else {
    // Try to find the file with .js or .jsx extension
    const fs = await import('fs');
    const statAsync = promisify(fs.stat);
    try {
      await statAsync(`${targetPath}.js`);
      targetPath = `${targetPath}.js`;
    } catch (err) {
      try {
        await statAsync(`${targetPath}.jsx`);
        targetPath = `${targetPath}.jsx`;
      } catch (jsxErr) {
        console.log(
          `${chalk.magenta.italic(targetPath)} doesn't ${chalk.red.inverse(
            'seem to exist in the given path'
          )}`
        );
        return;
      }
    }
  }

  await writeFileAsyncEs6(targetPath);
};

/**
 * Update all files in a folder recursively
 */
export const updateFolder: UpdateFolderFunction = async (cmd: string, folderName: string): Promise<void> => {
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
    
    // Process files in current directory
    for (const file of filesInFolder) {
      await updateFile('updateFolder', `${folderName}/${file}`);
    }

    console.log('');
    console.log(
      `folder ${chalk.underline.yellowBright(folderName)} and js/jsx files inside are now ${chalk.greenBright(
        'ready'
      )}!`
    );
    stdout.write('\x1b[2J');
    stdout.write('\x1b[0f');
    console.log(
      `Your folder and files have been updated. Thank you for using ${chalk.yellowBright(
        'move-prop-types'
      )}`
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error processing folder ${folderName}:`, errorMessage);
  }
};

/**
 * Display help examples
 */
export const helpExamples: HelpExamplesFunction = (): string => {
  return `
  Examples:
    $ move-prop-types --help for info
    $ move-prop-types -P ../dir1/dir2/filename.[js|jsx] - This will run replace only on the given file.
    $ move-prop-types -F ../dir1/dir2 - This will run the update for all the files inside the given directory
    $ move-prop-types -I -F ../dir1/dir2 - This will install prop-types to dependencies and run the update for all the files inside the given directory
`;
};

/**
 * Find matching value in array
 */
export const findMatch: FindMatchFunction = (givenValue: string[], setToMatch: string[]): string => {
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