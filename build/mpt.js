#!/usr/bin/env node 
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var propReplace = _interopDefault(require('commander'));
var process = require('process');
var chalk = _interopDefault(require('chalk'));

var global$1 = typeof global !== "undefined" ? global :
            typeof self !== "undefined" ? self :
            typeof window !== "undefined" ? window : {};

// shim for using process in browser
// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
var cachedSetTimeout = defaultSetTimout;
var cachedClearTimeout = defaultClearTimeout;
if (typeof global$1.setTimeout === 'function') {
    cachedSetTimeout = setTimeout;
}
if (typeof global$1.clearTimeout === 'function') {
    cachedClearTimeout = clearTimeout;
}

function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}
function nextTick(fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
}
// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
var title = 'browser';
var platform = 'browser';
var browser = true;
var env = {};
var argv$1 = [];
var version = ''; // empty string to avoid regexp issues
var versions = {};
var release = {};
var config = {};

function noop() {}

var on = noop;
var addListener = noop;
var once = noop;
var off = noop;
var removeListener = noop;
var removeAllListeners = noop;
var emit = noop;

function binding(name) {
    throw new Error('process.binding is not supported');
}

function cwd () { return '/' }
function chdir (dir) {
    throw new Error('process.chdir is not supported');
}
function umask() { return 0; }

// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
var performance = global$1.performance || {};
var performanceNow =
  performance.now        ||
  performance.mozNow     ||
  performance.msNow      ||
  performance.oNow       ||
  performance.webkitNow  ||
  function(){ return (new Date()).getTime() };

// generate timestamp or delta
// see http://nodejs.org/api/process.html#process_process_hrtime
function hrtime(previousTimestamp){
  var clocktime = performanceNow.call(performance)*1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor((clocktime%1)*1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds<0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds,nanoseconds]
}

var startTime = new Date();
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1000;
}

var process$1 = {
  nextTick: nextTick,
  title: title,
  browser: browser,
  env: env,
  argv: argv$1,
  version: version,
  versions: versions,
  on: on,
  addListener: addListener,
  once: once,
  off: off,
  removeListener: removeListener,
  removeAllListeners: removeAllListeners,
  emit: emit,
  binding: binding,
  cwd: cwd,
  chdir: chdir,
  umask: umask,
  hrtime: hrtime,
  platform: platform,
  release: release,
  config: config,
  uptime: uptime
};

var version$1 = "0.4.3";

var es6PropTypeJust = /,\s?{\sPropTypes\s}/g;
var es6PropTypeRight = /,\s?PropTypes\s?}/g;
var es6PropTypeLeft = /PropTypes\s?,/g;
var fileEncoding = 'utf-8';
var importState = '\nimport PropTypes from \'prop-types\';';
var reactProto = /React.PropTypes./g;

/**
 * Module dependencies
 */
var _require = require('fs');
var lstatSync = _require.lstatSync;
var readdir = _require.readdir;
var readFile = _require.readFile;
var stat = _require.stat;
var writeFile = _require.writeFile;

var _require2 = require('child_process');
var exec = _require2.exec;

/**
 *
 * @return {Promise.<void>}
 */


var installPackage = function installPackage() {
  console.log('');
  try {
    // Check if the package is installed in the project
    require.resolve('prop-types');
    console.log(chalk.cyan.underline.bold('prop-types') + ' is already installed in your project');
    console.log('');
  } catch (e) {
    console.log('Installing prop-types to your project');
    exec('npm i --color=always prop-types -S', function (err, stdout, stderr) {
      if (err) {
        // node couldn't execute the command
        console.log('stderr: ' + stderr);
        console.log('');
        return;
      }
      // the *entire* stdout (buffered)
      console.log('' + chalk.hex('#FF6347').bold('Installation underway'));
      console.log(stdout);
      console.log('');
      console.log(chalk.cyan.underline.bold('prop-types') + ' is now installed');
      console.log('');
      console.log('Thank you for using the package, if you like it, do ' + chalk.red.bold('star') + ' the repo');
      console.log('');
    });
  }
  console.groupEnd();
};

/**
 *
 * @param fileAndPath
 */
var writeFileAsyncEs6 = function writeFileAsyncEs6(fileAndPath) {
  readFile(fileAndPath, fileEncoding, function (err, data) {
    if (err) {
      throw err;
    }
    var isPropTypeUsed = es6PropTypeJust.test(data) || es6PropTypeLeft.test(data) || es6PropTypeLeft.test(data);
    var isPropTypeAlreadyPresent = data.indexOf(importState) !== -1;

    if (!isPropTypeUsed || isPropTypeAlreadyPresent) {
      return;
    }

    var newData = typeof data === 'string' ? data.replace(es6PropTypeJust, '') : data;
    newData = newData.replace(es6PropTypeLeft, '');
    newData = newData.replace(es6PropTypeRight, ' }');
    newData = typeof newData === 'string' ? newData.replace(reactProto, 'PropTypes.') : newData;
    newData = typeof newData === 'string' ? [newData.slice(0, newData.indexOf('\';\n') + 2), importState, newData.slice(newData.indexOf('\';\n') + 2)].join('') : newData;
    newData ? writeFile(fileAndPath, newData, fileEncoding, function (err) {
      if (err) {
        throw err;
      }
    }) : null;
  });
  console.log(chalk.magenta.italic(fileAndPath) + ' just got ' + chalk.green('updated') + '!');
};

/**
 *
 * @param cmd
 * @param {string} fileAndPath
 */
var updateFile = function updateFile(cmd, fileAndPath) {
  // console.log(`option ${chalk.bold.magenta.underline('P')} ${cmd} ${val}`);
  if (/[.]/.exec(fileAndPath)) {
    if (!/\S+.js[x]?$/.test(fileAndPath)) {
      return;
    }
  } else {
    stat(fileAndPath + '.js', function (err) {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(chalk.magenta.italic(fileAndPath + '.js') + ' doesn\'t ' + chalk.red.inverse('seem to exist in the given path'));
        }
        console.log('error : ' + err);
      }
      fileAndPath = fileAndPath + '.js';
    });
    stat(fileAndPath + '.jsx', function (err) {
      if (err) {
        if (err.code === 'ENOENT') {
          console.log(chalk.magenta.italic(fileAndPath + '.jsx') + ' doesn\'t ' + chalk.red.inverse('seem to exist in the given path'));
        }
        console.log('error : ' + err);
      }
      fileAndPath = fileAndPath + '.jsx';
    });
  }
  writeFileAsyncEs6(fileAndPath);
  cmd !== 'updateFolder' ? console.log('Thank you for using the package, if you like it, do ' + chalk.red.bold('star') + ' the repo') : null;
};

/**
 *
 * @param cmd
 * @param {string} folderName
 */
var updateFolder = function updateFolder(cmd, folderName) {
  console.log('');
  readdir(folderName, function (err, files) {
    if (err) {
      console.log('error : ' + err);
    }
    var folderInFolder = files.filter(function (source) {
      return lstatSync(folderName + '/' + source).isDirectory();
    });
    folderInFolder.map(function (folder) {
      updateFolder('updateFolder', folderName + '/' + folder);
    });
    var filesInFolder = files.filter(function (source) {
      return !lstatSync(folderName + '/' + source).isDirectory();
    });
    filesInFolder.forEach(function (file) {
      updateFile('updateFolder', folderName + '/' + file);
    });
    console.log('');
    console.log('folder ' + chalk.underline.yellowBright(folderName) + ' and js/jsx files inside are now ' + chalk.greenBright('ready') + '!');
    console.log('');
    console.log('Thank you for using the package, if you like it, do ' + chalk.red.bold('star') + ' the repo');
    console.log('');
  });
};

/**
 *
 */
var helpExamples = function helpExamples() {
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
var findMatch = function findMatch(givenValue, setToMatch) {
  var index = 0;
  if (!(givenValue instanceof Array)) {
    return;
  }
  givenValue.filter(function (val) {
    if (val === setToMatch[0] || val === setToMatch[1]) {
      index = givenValue.indexOf(val) + 1;
    }
  });
  return index ? givenValue[index] : '';
};

/**
 * Module dependencies.
 */
// No or unknown options given, will trigger help text
if (!(process.argv.indexOf('--install') !== -1 || process.argv.indexOf('-I') !== -1) && !(process.argv.indexOf('--path') !== -1 || process.argv.indexOf('-P') !== -1) && !(process.argv.indexOf('--folder') !== -1 || process.argv.indexOf('-F') !== -1)) {
  process.argv.push('--help');
}

var filePath = findMatch(process.argv, ['--path', '-P']);

var folderPath = findMatch(process.argv, ['--folder', '-F']);

propReplace.command('move-prop-types').alias('mpt').usage('[options] [file|folder]').version('' + version$1).option('-I, --install', 'install the latest proptypes and then continue with rest of the commands', installPackage, { cmd: process$1.argv }).option('-P, --path', 'input path information of the file to update', updateFile, filePath).option('-F, --folder', 'input folder info where all the files would be updated', updateFolder, folderPath).on('--help , -H', helpExamples).parse(process.argv);

propReplace.cli = true;

exports.mpt = propReplace;
