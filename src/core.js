/**
 * Module dependencies.
 */
import propReplace from 'commander';
import { argv } from 'process';

import { version } from '../package.json';
import { findMatch, helpExamples, installPackage, updateFile, updateFolder } from './helper';

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
  .version(`${version}`)
  .option('-I, --install', 'install the latest prop-types package and then continue with rest of the commands', installPackage, { cmd: process.argv })
  .option('-P, --path', 'input path information of the file to update', updateFile, filePath)
  .option('-F, --folder', 'input folder info where all the files would be updated', updateFolder, folderPath)
  .on('--help , -H', helpExamples)
  .parse(argv);

propReplace.cli = true;

export default propReplace;
