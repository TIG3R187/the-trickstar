import fs from 'node:fs/promises';
import path from 'node:path';
// Build a clean deploy artifact; never include Git, node_modules or Quadri’s app.
const target = path.resolve('dist');
await fs.mkdir(target, { recursive: true });
for (const file of ['index.html', 'README.html', 'README.md', 'assignment.md']) await fs.copyFile(file, path.join(target, file));
for (const dir of ['assets', 'guide']) await fs.cp(dir, path.join(target, dir), { recursive: true });
await fs.writeFile(path.join(target, '.nojekyll'), '');
console.log('Prepared dist/ with the browser entry, guide, brief and local assets.');
