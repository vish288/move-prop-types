/**
 * Module dependencies.
 */
import { Command } from 'commander';
import { argv } from 'process';

import { version } from '../package.json' with { type: 'json' };
import { findMatch, helpExamples, installPackage, updateFile, updateFolder } from './helper.js';
import type { CommandOptions } from './types.js';

// Type augmentation for the CLI property
declare module 'commander' {
  interface Command {
    cli?: boolean;
  }
}

export const createCommand = (): Command => {
  const propReplace = new Command();

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
    .addHelpText('after', helpExamples);

  propReplace.cli = true;
  return propReplace;
};

export const runCLI = async (processArgv: string[] = argv): Promise<void> => {
  const propReplace = createCommand();
  
  // No or unknown options given, will trigger help text
  const argvCopy = [...processArgv];
  if (
    !(argvCopy.indexOf('--install') !== -1 || argvCopy.indexOf('-I') !== -1) &&
    !(argvCopy.indexOf('--path') !== -1 || argvCopy.indexOf('-P') !== -1) &&
    !(argvCopy.indexOf('--folder') !== -1 || argvCopy.indexOf('-F') !== -1)
  ) {
    argvCopy.push('--help');
  }

  const filePath: string = findMatch(argvCopy, ['--path', '-P']);
  const folderPath: string = findMatch(argvCopy, ['--folder', '-F']);

  propReplace.parse(argvCopy);

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
};

// Create the default export command for testing
const defaultCommand = createCommand();

export default defaultCommand;
