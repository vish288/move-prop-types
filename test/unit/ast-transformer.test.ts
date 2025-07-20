import { describe, it, expect } from 'vitest';
import { transformWithAST, needsTransformation } from '../../src/ast-transformer.js';

describe('AST Transformer', () => {
  describe('needsTransformation', () => {
    it('should detect ES6 PropTypes imports', () => {
      const code = `import React, { Component, PropTypes } from 'react';`;
      expect(needsTransformation(code)).toBe(true);
    });

    it('should detect React.PropTypes usage', () => {
      const code = `
        import React from 'react';
        Component.propTypes = {
          name: React.PropTypes.string
        };
      `;
      expect(needsTransformation(code)).toBe(true);
    });

    it('should not detect transformation need in clean files', () => {
      const code = `
        import React from 'react';
        import PropTypes from 'prop-types';
        
        Component.propTypes = {
          name: PropTypes.string
        };
      `;
      expect(needsTransformation(code)).toBe(false);
    });

    it('should handle files without PropTypes', () => {
      const code = `
        import React from 'react';
        const Component = () => <div>Hello</div>;
        export default Component;
      `;
      expect(needsTransformation(code)).toBe(false);
    });
  });

  describe('transformWithAST', () => {
    it('should transform ES6 PropTypes imports correctly', () => {
      const code = `import React, { Component, PropTypes } from 'react';`;
      const result = transformWithAST(code);
      
      expect(result.modified).toBe(true);
      expect(result.code).toContain("import React, { Component } from 'react';");
      expect(result.code).toMatch(/import PropTypes from ['"]prop-types['"];/);
    });

    it('should handle PropTypes-only imports', () => {
      const code = `import React, { PropTypes } from 'react';`;
      const result = transformWithAST(code);
      
      expect(result.modified).toBe(true);
      expect(result.code).toContain("import React from 'react';");
      expect(result.code).toMatch(/import PropTypes from ['"]prop-types['"];/);
    });

    it('should transform React.PropTypes usage', () => {
      const code = `
        import React from 'react';
        Component.propTypes = {
          name: React.PropTypes.string,
          age: React.PropTypes.number.isRequired
        };
      `;
      const result = transformWithAST(code);
      
      expect(result.modified).toBe(true);
      expect(result.code).toContain('PropTypes.string');
      expect(result.code).toContain('PropTypes.number.isRequired');
      expect(result.code).not.toContain('React.PropTypes');
      expect(result.code).toMatch(/import PropTypes from ['"]prop-types['"];/);
    });

    it('should handle mixed import and usage patterns', () => {
      const code = `
        import React, { Component, PropTypes, useState } from 'react';
        
        const MyComponent = () => {
          const [state, setState] = useState(null);
          return <div>Mixed</div>;
        };
        
        MyComponent.propTypes = {
          data: React.PropTypes.object,
          callback: PropTypes.func
        };
        
        export default MyComponent;
      `;
      const result = transformWithAST(code);
      
      expect(result.modified).toBe(true);
      expect(result.code).toContain("import React, { Component, useState } from 'react';");
      expect(result.code).toMatch(/import PropTypes from ['"]prop-types['"];/);
      expect(result.code).toContain('PropTypes.object');
      expect(result.code).toContain('PropTypes.func');
      expect(result.code).not.toContain('React.PropTypes');
    });

    it('should preserve existing PropTypes import', () => {
      const code = `
        import React from 'react';
        import PropTypes from 'prop-types';
        
        Component.propTypes = {
          name: React.PropTypes.string
        };
      `;
      const result = transformWithAST(code);
      
      expect(result.modified).toBe(true);
      expect(result.code).toContain('PropTypes.string');
      expect(result.code).not.toContain('React.PropTypes');
      // Should not add duplicate import
      expect((result.code.match(/import PropTypes from 'prop-types'/g) || []).length).toBe(1);
    });

    it('should handle complex PropTypes chains', () => {
      const code = `
        Component.propTypes = {
          items: React.PropTypes.arrayOf(React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            name: React.PropTypes.string
          })).isRequired,
          callback: React.PropTypes.oneOfType([
            React.PropTypes.func,
            React.PropTypes.object
          ])
        };
      `;
      const result = transformWithAST(code);
      
      expect(result.modified).toBe(true);
      expect(result.code).toContain('PropTypes.arrayOf(PropTypes.shape({');
      expect(result.code).toContain('PropTypes.number.isRequired');
      expect(result.code).toContain('PropTypes.oneOfType([');
      expect(result.code).not.toContain('React.PropTypes');
      expect(result.code).toMatch(/import PropTypes from ['"]prop-types['"];/);
    });

    it('should handle TypeScript files', () => {
      const code = `
        import React, { Component, PropTypes } from 'react';
        
        interface Props {
          name: string;
        }
        
        const MyComponent: React.FC<Props> = ({ name }) => <div>{name}</div>;
        
        MyComponent.propTypes = {
          name: PropTypes.string.isRequired
        };
      `;
      const result = transformWithAST(code, 'test.tsx');
      
      expect(result.modified).toBe(true);
      expect(result.code).toContain("import React, { Component } from 'react';");
      expect(result.code).toMatch(/import PropTypes from ['"]prop-types['"];/);
      expect(result.code).toContain('interface Props');
    });

    it('should not modify files that do not need transformation', () => {
      const code = `
        import React from 'react';
        import PropTypes from 'prop-types';
        
        const Component = () => <div>Hello</div>;
        
        Component.propTypes = {
          name: PropTypes.string
        };
      `;
      const result = transformWithAST(code);
      
      expect(result.modified).toBe(false);
    });

    it('should handle syntax errors gracefully', () => {
      const code = `import React, { Component, PropTypes } from 'react'; function( {{{`;
      const result = transformWithAST(code);
      
      // Should return original code when parsing fails
      expect(result.modified).toBe(false);
      expect(result.code).toBe(code);
    });
  });

  describe('edge cases', () => {
    it('should handle comments and preserve formatting context', () => {
      const code = `
        // Import React and PropTypes
        import React, { Component, PropTypes } from 'react';
        
        /**
         * Component with PropTypes
         */
        Component.propTypes = {
          // Name property
          name: React.PropTypes.string // String type
        };
      `;
      const result = transformWithAST(code);
      
      expect(result.modified).toBe(true);
      expect(result.code).toContain('PropTypes.string');
      expect(result.code).not.toContain('React.PropTypes');
    });

    it('should handle multiple React imports', () => {
      const code = `
        import React, { PropTypes } from 'react';
        import { Component } from 'react';
      `;
      const result = transformWithAST(code);
      
      expect(result.modified).toBe(true);
      expect(result.code).toMatch(/import PropTypes from ['"]prop-types['"];/);
    });
  });
});