import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { updateFile, updateFolder } from '../../src/helper.js';

describe('Integration Tests', () => {
  const testDir = path.join(process.cwd(), 'test', 'fixtures', 'integration');

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch (e) {
      // Directory might not exist, ignore
    }
  });

  describe('Real-world React component transformation', () => {
    it('should transform a complete React component file', async () => {
      const componentContent = `import React, { Component, PropTypes } from 'react';

class UserProfile extends Component {
  render() {
    const { name, email, age } = this.props;
    return (
      <div className="user-profile">
        <h2>{name}</h2>
        <p>Email: {email}</p>
        <p>Age: {age}</p>
      </div>
    );
  }
}

UserProfile.propTypes = {
  name: React.PropTypes.string.isRequired,
  email: React.PropTypes.string.isRequired,
  age: React.PropTypes.number
};

UserProfile.defaultProps = {
  age: 0
};

export default UserProfile;`;

      const filePath = path.join(testDir, 'UserProfile.jsx');
      await fs.writeFile(filePath, componentContent);
      
      await updateFile('test', filePath);
      
      const transformedContent = await fs.readFile(filePath, 'utf-8');
      
      // Should have prop-types import
      expect(transformedContent).toContain("import PropTypes from 'prop-types';");
      
      // Should not have PropTypes in React import
      expect(transformedContent).toContain('import React, { Component } from \'react\';');
      
      // Should use PropTypes instead of React.PropTypes
      expect(transformedContent).toContain('PropTypes.string.isRequired');
      expect(transformedContent).toContain('PropTypes.number');
      expect(transformedContent).not.toContain('React.PropTypes');
    });

    it('should handle functional component with PropTypes', async () => {
      const componentContent = `import React, { PropTypes } from 'react';

const Button = ({ label, onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled}>
    {label}
  </button>
);

Button.propTypes = {
  label: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func.isRequired,
  disabled: React.PropTypes.bool
};

Button.defaultProps = {
  disabled: false
};

export default Button;`;

      const filePath = path.join(testDir, 'Button.js');
      await fs.writeFile(filePath, componentContent);
      
      await updateFile('test', filePath);
      
      const transformedContent = await fs.readFile(filePath, 'utf-8');
      
      expect(transformedContent).toContain("import PropTypes from 'prop-types';");
      expect(transformedContent).toContain('import React from \'react\';');
      expect(transformedContent).toContain('PropTypes.string.isRequired');
      expect(transformedContent).toContain('PropTypes.func.isRequired');
      expect(transformedContent).toContain('PropTypes.bool');
      expect(transformedContent).not.toContain('React.PropTypes');
    });

    it('should handle complex PropTypes definitions', async () => {
      const componentContent = `import React, { Component, PropTypes } from 'react';

class DataTable extends Component {
  render() {
    // Component implementation
    return <div>Table</div>;
  }
}

DataTable.propTypes = {
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  columns: React.PropTypes.arrayOf(React.PropTypes.shape({
    key: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired,
    render: React.PropTypes.func
  })).isRequired,
  onRowClick: React.PropTypes.func,
  pagination: React.PropTypes.oneOfType([
    React.PropTypes.bool,
    React.PropTypes.object
  ]),
  loading: React.PropTypes.bool
};

export default DataTable;`;

      const filePath = path.join(testDir, 'DataTable.jsx');
      await fs.writeFile(filePath, componentContent);
      
      await updateFile('test', filePath);
      
      const transformedContent = await fs.readFile(filePath, 'utf-8');
      
      expect(transformedContent).toContain("import PropTypes from 'prop-types';");
      expect(transformedContent).toContain('PropTypes.arrayOf(PropTypes.object)');
      expect(transformedContent).toContain('PropTypes.shape({');
      expect(transformedContent).toContain('PropTypes.oneOfType([');
      expect(transformedContent).not.toContain('React.PropTypes');
    });
  });

  describe('Folder processing', () => {
    it('should transform entire project structure', async () => {
      const components = {
        'Header.jsx': `import React, { PropTypes } from 'react';
const Header = ({ title }) => <h1>{title}</h1>;
Header.propTypes = { title: React.PropTypes.string };
export default Header;`,
        
        'components/Button.js': `import React, { PropTypes } from 'react';
const Button = ({ onClick }) => <button onClick={onClick}>Click</button>;
Button.propTypes = { onClick: React.PropTypes.func };
export default Button;`,
        
        'utils/helpers.js': `// This file should be skipped as it doesn't use React prop validation
export const formatDate = (date) => date.toISOString();`,
        
        'components/Form/Input.jsx': `import React, { PropTypes } from 'react';
const Input = ({ value, onChange }) => <input value={value} onChange={onChange} />;
Input.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func.isRequired
};
export default Input;`
      };

      // Create file structure
      for (const [filePath, content] of Object.entries(components)) {
        const fullPath = path.join(testDir, filePath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content);
      }

      // Process the entire folder
      await updateFolder('test', testDir);

      // Verify transformations
      const headerContent = await fs.readFile(path.join(testDir, 'Header.jsx'), 'utf-8');
      expect(headerContent).toContain("import PropTypes from 'prop-types';");
      expect(headerContent).not.toContain('React.PropTypes');

      const buttonContent = await fs.readFile(path.join(testDir, 'components/Button.js'), 'utf-8');
      expect(buttonContent).toContain("import PropTypes from 'prop-types';");
      expect(buttonContent).not.toContain('React.PropTypes');

      const inputContent = await fs.readFile(path.join(testDir, 'components/Form/Input.jsx'), 'utf-8');
      expect(inputContent).toContain("import PropTypes from 'prop-types';");
      expect(inputContent).not.toContain('React.PropTypes');

      // Helper file should remain unchanged
      const helperContent = await fs.readFile(path.join(testDir, 'utils/helpers.js'), 'utf-8');
      expect(helperContent).toContain('formatDate');
      expect(helperContent).not.toContain("import PropTypes from 'prop-types';");
      expect(helperContent).toContain('This file should be skipped');
    });
  });

  describe('Edge cases', () => {
    it('should handle files without PropTypes usage', async () => {
      const content = `import React from 'react';

const SimpleComponent = () => <div>Hello World</div>;

export default SimpleComponent;`;

      const filePath = path.join(testDir, 'SimpleComponent.js');
      await fs.writeFile(filePath, content);
      
      await updateFile('test', filePath);
      
      const result = await fs.readFile(filePath, 'utf-8');
      expect(result).toBe(content); // Should remain unchanged
    });

    it('should handle files that already use prop-types', async () => {
      const content = `import React from 'react';
import PropTypes from 'prop-types';

const ModernComponent = ({ name }) => <div>{name}</div>;

ModernComponent.propTypes = {
  name: PropTypes.string.isRequired
};

export default ModernComponent;`;

      const filePath = path.join(testDir, 'ModernComponent.js');
      await fs.writeFile(filePath, content);
      
      await updateFile('test', filePath);
      
      const result = await fs.readFile(filePath, 'utf-8');
      expect(result).toBe(content); // Should remain unchanged
    });

    it('should handle mixed import styles', async () => {
      const content = `import React, { Component, PropTypes, useState } from 'react';

const MixedComponent = () => {
  const [state, setState] = useState(null);
  return <div>Mixed</div>;
};

MixedComponent.propTypes = {
  data: React.PropTypes.object
};

export default MixedComponent;`;

      const filePath = path.join(testDir, 'MixedComponent.jsx');
      await fs.writeFile(filePath, content);
      
      await updateFile('test', filePath);
      
      const result = await fs.readFile(filePath, 'utf-8');
      expect(result).toContain("import PropTypes from 'prop-types';");
      expect(result).toContain('import React, { Component, useState } from \'react\';');
      expect(result).toContain('PropTypes.object');
      expect(result).not.toContain('React.PropTypes');
    });
  });
});