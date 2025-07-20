import type { FileEncoding } from './types.js';

export const es6PropTypeJust: RegExp = /,\s?{\s?PropTypes\s?}/g;
export const es6PropTypeRight: RegExp = /,\s?PropTypes\s?}/g;
export const es6PropTypeLeft: RegExp = /{\s?PropTypes\s?,/g;
export const fileEncoding: FileEncoding = 'utf-8';
export const importState: string = "\nimport PropTypes from 'prop-types';";
export const reactProto: RegExp = /React\.PropTypes\./g;
export const es5PropType: string = '';
