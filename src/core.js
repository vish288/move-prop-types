#!/usr/bin/env node

/**
 * Module dependencies.
 */
const propReplace = require('commander');
const {argv} = require('process');

const {installPackage, updateFile, updateFolder, helpExamples, findMatch} = require('./helper');
const packageJson = require('../package.json');

// const options = `${propReplace.install ? 'install' : ''} and${(propReplace.path ? ' single file with relative path' : '') || (propReplace.folder ? ' folder ' + process.argv + ' of js(x) files' : '')}`;
//
// console.log(`Prop replace has been called with commands ${options}`);
// console.log('');

// No or unknown options given, will trigger help text
if (!(argv.indexOf('--install') !== -1 || argv.indexOf('-I') !== -1) &&
    !(argv.indexOf('--path') !== -1 || argv.indexOf('-P') !== -1) &&
    !(argv.indexOf('--folder') !== -1 || argv.indexOf('-F') !== -1)) {
  argv.push('--help');
}

const filePath = findMatch(argv, ['--path', '-P']);

const folderPath = findMatch(argv, ['--folder', '-F']);

propReplace
  .command('move-prop-types')
  .alias('mpt')
  .usage('[options] [file|folder]')
  .version(`${packageJson.version}`)
  .option('-I, --install', 'install the latest proptypes and then continue with rest of the commands', installPackage, {cmd: process.argv})
  .option('-P, --path', 'input path information of the file to update', updateFile, filePath)
  .option('-F, --folder', 'input folder info where all the files would be updated', updateFolder, folderPath)
  .on('--help , -H', helpExamples)
  .parse(argv);

exports.module = propReplace;
