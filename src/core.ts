/**
 * Module dependencies.
 */
import { Command } from 'commander';
import { argv } from 'process';

import { version } from '../package.json' with { type: 'json' };
import { findMatch, helpExamples, installPackage, updateFile, updateFolder } from './helper.js';
import type { CommandOptions } from './types.js';

const propReplace = new Command();

// No or unknown options given, will trigger help text
if (
  !(argv.indexOf('--install') !== -1 || argv.indexOf('-I') !== -1) &&
  !(argv.indexOf('--path') !== -1 || argv.indexOf('-P') !== -1) &&
  !(argv.indexOf('--folder') !== -1 || argv.indexOf('-F') !== -1)
) {
  argv.push('--help');
}

const filePath: string = findMatch(argv, ['--path', '-P']);
const folderPath: string = findMatch(argv, ['--folder', '-F']);

propReplace
  .name('move-prop-types')
  .alias('mpt')
  .usage('[options] [file|folder]')
  .version(version)
  .option(
    '-I, --install',
    'install the latest prop-types package and then continue with rest of the commands'
  )
  .option('-P, --path <path>', 'input path information of the file to update')
  .option('-F, --folder <folder>', 'input folder info where all the files would be updated')
  .addHelpText('after', helpExamples)
  .parse(argv);

const options = propReplace.opts() as CommandOptions;

// Handle the options
if (options.install) {
  await installPackage();
}

if (options.path || filePath) {
  await updateFile('updateFile', options.path || filePath);
}

if (options.folder || folderPath) {
  await updateFolder('updateFolder', options.folder || folderPath);
}

// Type augmentation for the CLI property
declare module 'commander' {
  interface Command {
    cli?: boolean;
  }
}

propReplace.cli = true;

export default propReplace;