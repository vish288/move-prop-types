#!/usr/bin/env node
/**
 * Module dependencies
 */
const {exec} = require('child_process');
const chalk = require('chalk');

exports.installPackage = (cmd) => {
    console.group('using option i');
    console.log(`executing ${chalk.blue(cmd)} with option i`);
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
            console.log(`${chalk.hex('#FF6347').bold('Installation underway \n')} ${stdout}`);
            console.log('');

            console.log(`${chalk.cyan.underline.bold('prop-types')} is now installed`);
            console.log('');
        });
    }
    console.groupEnd();
};
