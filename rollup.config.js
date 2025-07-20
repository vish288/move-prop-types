import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'build/cli.js',
  external: [
    'commander', 
    'chalk', 
    'fs', 
    'util', 
    'process', 
    'child_process', 
    'prop-types'
  ],
  plugins: [
    json(),
    resolve({
      preferBuiltins: true,
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'bundled',
    }),
    terser({
      compress: {
        drop_console: false,
      },
      format: {
        comments: false,
      },
    }),
  ],
  output: {
    file: 'build/mpt.js',
    format: 'es',
    name: 'movePropTypes',
    inlineDynamicImports: true,
  },
};