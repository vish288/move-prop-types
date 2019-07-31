# move-prop-types

[![Build Status](https://travis-ci.org/vish1988/move-prop-types.svg?branch=master)](https://travis-ci.org/vish1988/move-prop-types)

Simple way to refactor your code to use the new prop-types package that has been separated out of the core react package.

## Why

I was working with few projects to audit and that was the n-th time i saw a project started about an year ago or so, where prop type check was still done from React core package.
The movement of prop-types from `react` to `prop-types` is as mundane a task possible and that was a reason to write a simpler way of getting the code updated.

## Usage

```bash
   Usage: move-prop-types|mpt [options] [file|folder]
   
   
     Options:
   
       -V, --version  output the version number
       -I, --install  install the latest prop-types package and then continue with rest of the commands
       -P, --path     input path information of the file to update
       -F, --folder   input folder info where all the files would be updated
       -h, --help     output usage information
```

## Examples

To install globally, run

    npm i -g move-prop-types 

and now you should be able to run the package via `move-prop-types` or `mpt` and for single files by invoking

    mpt -P <folder>/<filename>.<ext>

,currently supports usage on .js or .jsx files. For folder level usage, try using 

    mpt -F <folder>
    
If you feel lazy and lucky, try using `-I` in the command and we install `prop-types` for you in your project for you. :)

## Issues
Please do share your comments as well comments and do raise issues for any specific requests or bugs you face.

### Backlog
* test cases for the code
* implement es5 support
* refactor code in a more efficient way.


## License
move-prop-types is released under MIT license.
[LICENSE](LICENSE)
