#!/usr/bin/env node
/**
 * Module dependencies
 */
const util = require('util');
const {exec} = require('child_process');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const fileEncod = 'utf-8';


const asyncExec = util.promisify(exec);

exports.installPackage = async (cmd, val) => {
    // console.group('using option i');
    // console.log(`option ${chalk.bold.magenta.underline('I')} ${cmd} ${val.cmd}`);
    console.log('');
    try {
        // Check if the package is installed in the project
        require.resolve('prop-types');
        console.log(`${chalk.cyan.underline.bold('prop-types')} is already installed in your project`);
        console.log('');
    } catch (e) {
        console.log('Installing prop-types to your project');
        await asyncExec('npm i --color=always prop-types -S', (err, stdout, stderr) => {
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
    console.groupEnd();
};

const writeFileAsync = (val) => {
    fs.readFile(val, fileEncod, (err, data) => {
        if (err) {
            throw err;
        }
        let newData = (typeof data === 'string') ? data.replace(/[,]?PropTypes?,/, '') : data;
        newData = (typeof newData === 'string') ? newData.replace(/React.PropTypes[.]?/, 'PropTypes.') : newData;
        newData = (typeof newData === 'string') ? console.log(newData.indexOf('\'react\';')) : newData;

        newData ? fs.writeFile(val, newData, fileEncod, (err) => {
            if (err) {
                throw err;
            }
        }) : null;
    });
};

exports.updateFile = (cmd, val) => {
    console.log(`option ${chalk.bold.magenta.underline('P')} ${cmd} ${val}`);
    if (/[.]/.exec(val)) {
        if (/js$/.test(/[^.]+$/.exec(val)[0])) {
            writeFileAsync(val);
        }
    }
    else {

    }

};

exports.updateFolder = (cmd, val) => {
    console.log(`option ${chalk.bold.magenta.underline('F')} ${cmd} ${val}`);

};


exports.helpExamples = () => {
    console.log('');
    console.log('  Examples:');
    console.log('');
    console.log('    $ prop-replace --help for info');
    console.log('    $ prop-replace -P ../dir1/dir2/filename.[js|jsx] , This will run replace only on the given file.');
    console.log('    $ prop-replace -F ../dir1/dir2 , This will run the update for all the files inside the given directory');
    console.log('    $ prop-replace -I -F ../dir1/dir2 , This will install prop-types to dependencies and run the update for all the files inside the given directory');
    console.log('');
};


exports.findMatch = (arrayVal, arrayMatch) => {
    let index = 0;
    arrayVal.filter((val) => {
        if ((val === arrayMatch[0]) || (val === arrayMatch[1])) {
            index = arrayVal.indexOf(val) + 1;
        }
    });
    return index ? arrayVal[index] : 'null';
};

