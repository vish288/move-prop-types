import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'fs';
import path from 'path';

import { createCommand } from '../../src/core.js';

// Fails a pull request when the documentation contradicts the code it describes.
const root = path.resolve(__dirname, '..', '..');
const read = (file: string): string => readFileSync(path.join(root, file), 'utf-8');
const pkg = JSON.parse(read('package.json')) as {
  engines: { node: string };
  packageManager?: string;
};

const nodeMajor = Number(/(\d+)/.exec(pkg.engines.node)?.[1]);
const docs = [
  'readme.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  ...readdirSync(path.join(root, 'docs'))
    .filter((f) => f.endsWith('.md'))
    .map((f) => `docs/${f}`),
];

/** The body of the first markdown section whose heading contains `title`. */
const section = (markdown: string, title: string): string => {
  const lines = markdown.split('\n');
  const start = lines.findIndex((l) => /^#{1,6} /.test(l) && l.includes(title));
  if (start === -1) {
    return '';
  }
  const level = /^(#+)/.exec(lines[start] ?? '')?.[1]?.length ?? 1;
  const end = lines.findIndex((l, i) => i > start && new RegExp(`^#{1,${level}} `).test(l));
  return lines.slice(start + 1, end === -1 ? undefined : end).join('\n');
};

describe('documentation consistency', () => {
  it('README requirements state the Node.js version from package.json engines', () => {
    const requirements = section(read('readme.md'), 'Requirements');
    const stated = /Node\.js\D*(\d+)/.exec(requirements)?.[1];
    expect(Number(stated)).toBe(nodeMajor);
  });

  it('CONTRIBUTING prerequisites match engines and packageManager', () => {
    const prerequisites = section(read('CONTRIBUTING.md'), 'Prerequisites');
    expect(Number(/Node\.js\D*(\d+)/.exec(prerequisites)?.[1])).toBe(nodeMajor);

    const pnpmStated = /pnpm (\d+)/.exec(prerequisites)?.[1];
    if (pnpmStated !== undefined) {
      expect(pnpmMajor()).toBe(Number(pnpmStated));
    }
  });

  it('README documents exactly the options the CLI accepts', () => {
    const cli = createCommand().options.map((o) => `${o.short}, ${o.long}`);
    cli.push('-h, --help');
    const documented = [...new Set(read('readme.md').match(/-[A-Za-z], --[a-z][a-z-]*/g) ?? [])];
    expect(documented.sort()).toEqual(cli.sort());
  });

  it.each(docs)('relative links in %s point to existing files', (file) => {
    const links = [...read(file).matchAll(/\]\(([^)\s]+)\)/g)]
      .map((m) => m[1] ?? '')
      .filter((target) => !/^(https?:|mailto:|#)/.test(target))
      .map((target) => target.split('#')[0] ?? '');
    for (const target of links) {
      expect(existsSync(path.join(root, path.dirname(file), target)), `${file} → ${target}`).toBe(
        true
      );
    }
  });

  it.each(docs)('workflow files named in %s exist', (file) => {
    const workflows = [...read(file).matchAll(/`([\w-]+\.ya?ml)`/g)]
      .map((m) => m[1] ?? '')
      .filter((name) => !['pnpm-workspace.yaml', 'dependabot.yml'].includes(name));
    for (const name of workflows) {
      expect(existsSync(path.join(root, '.github', 'workflows', name)), `${file} → ${name}`).toBe(
        true
      );
    }
  });
});

function pnpmMajor(): number {
  return Number(/pnpm@(\d+)/.exec(pkg.packageManager ?? '')?.[1]);
}
