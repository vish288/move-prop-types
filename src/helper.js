/**
 * Module dependencies
 */
import chalk from 'chalk';
import { es6PropTypeJust, es6PropTypeLeft, es6PropTypeRight, fileEncoding, importState, reactProto } from './constants';

const { lstatSync, readdir, readFile, stat, writeFile } = require('fs');
const { exec } = require('child_process');

/**
 *
 * @return {Promise.<void>}
 */
export const installPackage = () => {
  console.log('');
  try {
    // Check if the package is installed in the project
    require.resolve('prop-types');
    console.log(`${chalk.cyan.underline.bold('prop-types')} is already installed in your project`);
    console.log('');
  } catch (e) {
    console.log('Installing prop-types to your project');
    exec('npm i --color=always prop-types -S', (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.log(`stderr: ${stderr}`);
        console.log('');
        return;
      }
      // the *entire* stdout (buffered)
      console.log(`${chalk.hex('#FF6347').bold('Installation underway')}`);
      console.log(stdout);
      console.log('');
      console.log(`${chalk.cyan.underline.bold('prop-types')} is now installed`);
      console.log('');
    });
  }
};

/**
 *
 * @param fileAndPath
 */
const writeFileAsyncEs6 = (fileAndPath) => {
  readFile(fileAndPath, fileEncoding, (err, data) => {
    if (err) {
      throw err;
    }
    const isPropTypeUsed = es6PropTypeJust.test(data) || es6PropTypeLeft.test(data) || es6PropTypeLeft.test(data);
    const isPropTypeAlreadyPresent = data.indexOf(importState) !== -1;

    if (!isPropTypeUsed || isPropTypeAlreadyPresent) {
      return;
    }

    let newData = (typeof data === 'string') ? data.replace(es6PropTypeJust, '') : data;
    newData = newData.replace(es6PropTypeLeft, '');
    newData = newData.replace(es6PropTypeRight, ' }');
    newData = (typeof newData === 'string') ? newData.replace(reactProto, 'PropTypes.') : newData;
    newData = (typeof newData === 'string') ? [newData.slice(0, newData.indexOf('\';\n') + 2), importState, newData.slice(newData.indexOf('\';\n') + 2)].join('') : newData;
    newData ? writeFile(fileAndPath, newData, fileEncoding, (err) => {
      if (err) {
        throw err;
      }
    }) : null;
  });
  console.log(`${chalk.magenta.italic(fileAndPath)} just got ${chalk.green('updated')}!`);
};

/**
 *
 * @param fileAndPath
 */
/* eslint-disable no-unused-vars */
const writeFileAsyncEs5 = (fileAndPath) => {
  readFile(fileAndPath, fileEncoding, (err, data) => {
    if (err) {
      throw err;
    }
    let newData = (typeof data === 'string') ? data.replace(/React.PropTypes[.]?/, 'PropTypes.') : data;
    newData = (typeof newData === 'string') ? newData.replace(/const PropTypes = require('react').PropTypes;$/, '') : newData;
    newData = (typeof newData === 'string') ? newData.replace(/{PropTypes} = require('react').PropTypes/, '') : newData;
    newData = (typeof newData === 'string') ? [newData.slice(0, newData.indexOf('\';\n') + 2), importState, newData.slice(newData.indexOf('\';\n') + 2)].join('') : newData;

    newData ? writeFile(fileAndPath, newData, fileEncoding, (err) => {
      if (err) {
        throw err;
      }
    }) : null;
  });
};

/**
 *
 * @param cmd
 * @param {string} fileAndPath
 */
export const updateFile = (cmd, fileAndPath) => {
  // console.log(`option ${chalk.bold.magenta.underline('P')} ${cmd} ${val}`);
  if (/[.]/.exec(fileAndPath)) {
    if (!(/\S+.js[x]?$/.test(fileAndPath))) {
      return;
    }
  } else {
    stat(`${fileAndPath}.js`, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(`${chalk.magenta.italic(fileAndPath + '.js')} doesn't ${chalk.red.inverse('seem to exist in the given path')}`);
        }
        console.log(`error : ${err}`);
      }
      fileAndPath = `${fileAndPath}.js`;
    });
    stat(`${fileAndPath}.jsx`, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(`${chalk.magenta.italic(fileAndPath + '.jsx')} doesn't ${chalk.red.inverse('seem to exist in the given path')}`);
        }
        console.log(`error : ${err}`);
      }
      fileAndPath = `${fileAndPath}.jsx`;
    });
  }
  writeFileAsyncEs6(fileAndPath);
};

/**
 *
 * @param cmd
 * @param {string} folderName
 */
export const updateFolder = (cmd, folderName) => {
  console.log('');
  readdir(folderName, (err, files) => {
    if (err) {
      console.log(`error : ${err}`);
    }
    const folderInFolder = files.filter(source => lstatSync(`${folderName}/${source}`).isDirectory());
    folderInFolder.map((folder) => {
      updateFolder('updateFolder', `${folderName}/${folder}`);
    });
    const filesInFolder = files.filter(source => !lstatSync(`${folderName}/${source}`).isDirectory());
    filesInFolder.forEach((file) => {
      updateFile('updateFolder', `${folderName}/${file}`);
    });
    console.log('');
    console.log('\\033[2J');
    console.log(`folder ${chalk.underline.yellowBright(folderName)} and js/jsx files inside are now ${chalk.greenBright('ready')}!`);
    console.log('');
    console.log(`Thank you for using ${chalk.bgGreen.white.italic('move-prop-types')}.`);
    console.log(`Thank you for using the package, if you like it, do ${chalk.red.bold('star')} the repo`);
    console.log('');
  });
};

/**
 *
 */
export const helpExamples = () => {
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    $ prop-replace --help for info');
  console.log('    $ prop-replace -P ../dir1/dir2/filename.[js|jsx] , This will run replace only on the given file.');
  console.log('    $ prop-replace -F ../dir1/dir2 , This will run the update for all the files inside the given directory');
  console.log('    $ prop-replace -I -F ../dir1/dir2 , This will install prop-types to dependencies and run the update for all the files inside the given directory');
  console.log('');
};

/**
 *
 * @param {array} givenValue
 * @param {array} setToMatch
 * @return {string}
 */
export const findMatch = (givenValue, setToMatch) => {
  let index = 0;
  if (!(givenValue instanceof Array)) {
    return;
  }
  givenValue.filter((val) => {
    if ((val === setToMatch[0]) || (val === setToMatch[1])) {
      index = givenValue.indexOf(val) + 1;
    }
  });
  return index ? givenValue[index] : '';
};
