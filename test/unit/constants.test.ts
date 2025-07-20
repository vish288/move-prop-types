import { describe, it, expect } from 'vitest';
import {
  es6PropTypeJust,
  es6PropTypeRight,
  es6PropTypeLeft,
  es6PropTypeMiddle,
  fileEncoding,
  importState,
  reactProto,
} from '../../src/constants.js';

describe('constants.ts', () => {
  describe('Regular Expressions', () => {
    it('should match es6PropTypeJust pattern', () => {
      es6PropTypeJust.lastIndex = 0; // Reset global regex state
      const text = 'import React, { PropTypes } from "react";';
      expect(es6PropTypeJust.test(text)).toBe(true);
      
      es6PropTypeJust.lastIndex = 0; // Reset before second test
      const text2 = 'import React, {PropTypes} from "react";';
      expect(es6PropTypeJust.test(text2)).toBe(true);
    });

    it('should match es6PropTypeRight pattern', () => {
      es6PropTypeRight.lastIndex = 0; // Reset global regex state
      const text = 'import React, { Component, PropTypes } from "react";';
      expect(es6PropTypeRight.test(text)).toBe(true);
      
      es6PropTypeRight.lastIndex = 0; // Reset before second test
      const text2 = 'import React, { Component, PropTypes} from "react";';
      expect(es6PropTypeRight.test(text2)).toBe(true);
    });

    it('should match es6PropTypeLeft pattern', () => {
      es6PropTypeLeft.lastIndex = 0; // Reset global regex state
      const text = 'import React, { PropTypes, Component } from "react";';
      expect(es6PropTypeLeft.test(text)).toBe(true);
      
      es6PropTypeLeft.lastIndex = 0; // Reset before second test
      const text2 = 'import React, { PropTypes , Component } from "react";';
      expect(es6PropTypeLeft.test(text2)).toBe(true);
    });

    it('should match es6PropTypeMiddle pattern', () => {
      es6PropTypeMiddle.lastIndex = 0; // Reset global regex state
      const text = 'import React, { Component, PropTypes, useState } from "react";';
      expect(es6PropTypeMiddle.test(text)).toBe(true);
      
      es6PropTypeMiddle.lastIndex = 0; // Reset before second test
      const text2 = 'import React, { Component , PropTypes , useState } from "react";';
      expect(es6PropTypeMiddle.test(text2)).toBe(true);
    });

    it('should match reactProto pattern', () => {
      reactProto.lastIndex = 0; // Reset global regex state
      const text = 'MyComponent.propTypes = { name: React.PropTypes.string };';
      expect(reactProto.test(text)).toBe(true);
      
      reactProto.lastIndex = 0; // Reset before second test
      const text2 = 'validation: React.PropTypes.func.isRequired';
      expect(reactProto.test(text2)).toBe(true);
    });
  });

  describe('Constants', () => {
    it('should have correct fileEncoding', () => {
      expect(fileEncoding).toBe('utf-8');
    });

    it('should have correct importState', () => {
      expect(importState).toBe("\nimport PropTypes from 'prop-types';");
    });
  });

  describe('Pattern Replacements', () => {
    it('should correctly replace es6PropTypeJust', () => {
      es6PropTypeJust.lastIndex = 0; // Reset global regex state
      const text = 'import React, { PropTypes } from "react";';
      const result = text.replace(es6PropTypeJust, '');
      expect(result).toBe('import React from "react";');
    });

    it('should correctly replace es6PropTypeLeft', () => {
      es6PropTypeLeft.lastIndex = 0; // Reset global regex state
      const text = 'import React, { PropTypes, Component } from "react";';
      let result = text.replace(es6PropTypeLeft, '{');
      // Apply the same cleanup that helper.ts does
      result = result.replace(/import React, \{\s+([^}]+)\s+\}/g, 'import React, { $1 }');
      expect(result).toBe('import React, { Component } from "react";');
    });

    it('should correctly replace es6PropTypeMiddle', () => {
      es6PropTypeMiddle.lastIndex = 0; // Reset global regex state
      const text = 'import React, { Component, PropTypes, useState } from "react";';
      const result = text.replace(es6PropTypeMiddle, ',');
      expect(result).toBe('import React, { Component, useState } from "react";');
    });

    it('should correctly replace es6PropTypeRight', () => {
      es6PropTypeRight.lastIndex = 0; // Reset global regex state
      const text = 'import React, { Component, PropTypes } from "react";';
      const result = text.replace(es6PropTypeRight, ' }');
      expect(result).toBe('import React, { Component } from "react";');
    });

    it('should correctly replace reactProto', () => {
      reactProto.lastIndex = 0; // Reset global regex state
      const text = 'MyComponent.propTypes = { name: React.PropTypes.string };';
      const result = text.replace(reactProto, 'PropTypes.');
      expect(result).toBe('MyComponent.propTypes = { name: PropTypes.string };');
    });
  });

  describe('Complex transformations', () => {
    it('should handle PropTypes at start of import list', () => {
      es6PropTypeLeft.lastIndex = 0; // Reset global regex state
      let text = 'import React, { PropTypes, Component } from "react";';
      
      // Apply transformations - es6PropTypeLeft should match and replace { PropTypes, with {
      text = text.replace(es6PropTypeLeft, '{');
      // Apply cleanup that helper.ts does
      text = text.replace(/import React, \{\s+([^}]+)\s+\}/g, 'import React, { $1 }');
      expect(text).toBe('import React, { Component } from "react";');
    });

    it('should handle PropTypes usage in code', () => {
      reactProto.lastIndex = 0; // Reset global regex state
      let text = `
Component.propTypes = {
  name: React.PropTypes.string,
  age: React.PropTypes.number.isRequired
};`;
      
      text = text.replace(reactProto, 'PropTypes.');
      expect(text).toContain('PropTypes.string');
      expect(text).toContain('PropTypes.number');
      expect(text).not.toContain('React.PropTypes');
    });

    it('should handle mixed import transformations', () => {
      es6PropTypeMiddle.lastIndex = 0; // Reset global regex state
      let text = 'import React, { Component, PropTypes, useState } from "react";';
      
      // Apply es6PropTypeMiddle transformation
      text = text.replace(es6PropTypeMiddle, ',');
      // Apply cleanup that helper.ts does
      text = text.replace(/import React, \{\s+([^}]+)\s+\}/g, 'import React, { $1 }');
      expect(text).toBe('import React, { Component, useState } from "react";');
    });
  });
});