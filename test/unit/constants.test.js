import { describe, it, expect } from 'vitest';
import {
  es6PropTypeJust,
  es6PropTypeRight,
  es6PropTypeLeft,
  fileEncoding,
  importState,
  reactProto,
} from '../../build/constants.js';

describe('constants.ts', () => {
  describe('Regular Expressions', () => {
    it('should match es6PropTypeJust pattern', () => {
      const text = 'import React, { PropTypes } from "react";';
      expect(es6PropTypeJust.test(text)).toBe(true);
      
      const text2 = 'import React, {PropTypes} from "react";';
      expect(es6PropTypeJust.test(text2)).toBe(true);
    });

    it('should match es6PropTypeRight pattern', () => {
      const text = 'import React, { Component, PropTypes } from "react";';
      expect(es6PropTypeRight.test(text)).toBe(true);
      
      const text2 = 'import React, { Component, PropTypes} from "react";';
      expect(es6PropTypeRight.test(text2)).toBe(true);
    });

    it('should match es6PropTypeLeft pattern', () => {
      const text = 'import React, { PropTypes, Component } from "react";';
      expect(es6PropTypeLeft.test(text)).toBe(true);
      
      const text2 = 'import React, { PropTypes , Component } from "react";';
      expect(es6PropTypeLeft.test(text2)).toBe(true);
    });

    it('should match reactProto pattern', () => {
      const text = 'MyComponent.propTypes = { name: React.PropTypes.string };';
      expect(reactProto.test(text)).toBe(true);
      
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
      const text = 'import React, { PropTypes } from "react";';
      const result = text.replace(es6PropTypeJust, '');
      expect(result).toBe('import React from "react";');
    });

    it('should correctly replace es6PropTypeLeft', () => {
      const text = 'import React, { PropTypes, Component } from "react";';
      const result = text.replace(es6PropTypeLeft, '');
      expect(result).toBe('import React, { Component } from "react";');
    });

    it('should correctly replace es6PropTypeRight', () => {
      const text = 'import React, { Component, PropTypes } from "react";';
      const result = text.replace(es6PropTypeRight, ' }');
      expect(result).toBe('import React, { Component } from "react";');
    });

    it('should correctly replace reactProto', () => {
      const text = 'MyComponent.propTypes = { name: React.PropTypes.string };';
      const result = text.replace(reactProto, 'PropTypes.');
      expect(result).toBe('MyComponent.propTypes = { name: PropTypes.string };');
    });
  });

  describe('Complex transformations', () => {
    it('should handle multiple PropTypes in import', () => {
      let text = 'import React, { Component, PropTypes, useState } from "react";';
      
      // Apply transformations in order
      text = text.replace(es6PropTypeLeft, '');
      expect(text).toBe('import React, { Component, useState } from "react";');
    });

    it('should handle PropTypes usage in code', () => {
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
  });
});