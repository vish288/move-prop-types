import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'index.js',
  external: ['commander', 'chalk', 'fs', 'util', 'process', 'child_process'],
  plugins: [
    json(),
    babel({
      exclude: 'node_modules/**',
      babelrc: false,
      presets: ['@babel/env']
    }),
    resolve({
      // use "jsnext:main" if possible
      // – see https://github.com/rollup/rollup/wiki/jsnext:main
      jsnext: true, // Default: false
      // use "main" field or index.js, even if it's not an ES6 module
      // (needs to be converted from CommonJS to ES6
      // – see https://github.com/rollup/rollup-plugin-commonjs
      main: true // Default: true
    }),
    globals(),
    builtins(),
    uglify()
  ],
  context: 'global',
  output: {
    file: 'build/mpt.js',
    format: 'cjs',
    name: 'movePropTypes'
  }
};
