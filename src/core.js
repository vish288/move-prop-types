#!/usr/bin/env node

/**
 * Module dependencies.
 */
const propReplace = require('commander');
const path = require('path');
const fs = require('fs');
const {installPackage} = require('./helper');

const helpExamples = () => {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ prop-replace --help for info');
    console.log('    $ prop-replace -p ../dir1/dir2/filename.[js|jsx] , This will run replace only on the given file.');
    console.log('    $ prop-replace -f ../dir1/dir2 , This will run the update for all the files inside the given directory');
    console.log('    $ prop-replace -if ../dir1/dir2 , This will install prop-types to dependencies and run the update for all the files inside the given directory');
    console.log('');
};

// const options = `${propReplace.install ? 'install' : ''} and${(propReplace.path ? ' single file with relative path' : '') || (propReplace.folder ? ' folder ' + process.argv + ' of js(x) files' : '')}`;
//
// console.log(`Prop replace has been called with commands ${options}`);
// console.log('');

propReplace
    .alias('move-prop-types')
    .usage('[options] <file(s) ...>')
    .version('0.1.0')
    .option('-I, --install', 'install the latest proptypes and then continue with rest of the commands', installPackage)
    .option('-p, --path', 'input path information of the file to update')
    .option('-f, --folder', 'input folder info where all the files would be updated')
    .on('--help', helpExamples)
    .parse(process.argv);


exports.module = propReplace;
