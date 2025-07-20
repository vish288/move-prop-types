#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';

interface ProcessArgv {
  slice(start: number): string[];
}

const fileName: string | undefined = (process.argv as unknown as ProcessArgv).slice(2)[0];

if (!fileName) {
  console.error('Error: Please provide a filename');
  process.exit(1);
}

try {
  const data: string = await readFile(fileName, 'utf-8');
  
  // Check if shebang already exists
  if (data.startsWith('#!/usr/bin/env node')) {
    console.log(`${fileName} already has shebang`);
  } else {
    const result: string = `#!/usr/bin/env node\n${data}`;
    await writeFile(fileName, result, 'utf8');
    console.log(`Updated ${fileName} with shebang`);
  }
} catch (err: unknown) {
  const errorMessage = err instanceof Error ? err.message : String(err);
  console.error('Error updating file:', errorMessage);
  process.exit(1);
}
