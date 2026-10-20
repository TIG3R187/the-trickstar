import fs from 'node:fs/promises';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import path from 'node:path';

const context = {};
vm.runInNewContext(await fs.readFile('guide/content.js', 'utf8'), context);
const c = context.POCKET_PAL;
assert.equal(c.missions.length, 10);
assert.equal(c.rubric.reduce((sum, row) => sum + row[1], 0), 100);
for (const file of ['assignment.md', 'README.md']) {
  const text = await fs.readFile(file, 'utf8');
  assert(text.includes('Quadri') && text.toLowerCase().includes(c.goal.toLowerCase()) && text.includes(c.outcome), `${file}: personalised goal and outcome`);
  for (const m of c.missions) assert(text.includes(m.title) && text.includes(m.what), `${file}: ${m.title}`);
  for (const r of c.rules) assert(text.includes(r[1]), `${file}: rule ${r[0]}`);
  for (const match of text.matchAll(/(?:src="([^"]+)"|\]\(([^)]+)\))/g)) {
    const link = match[1] || match[2];
    if (!link.startsWith('http') && !link.startsWith('#')) await fs.access(path.resolve(link.split('#')[0]));
  }
}
const html = await fs.readFile('README.html', 'utf8');
for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  const link = match[1];
  if (link.startsWith('#')) { if (link.length > 1) assert(html.includes(`id="${link.slice(1)}"`), `Anchor ${link}`); }
  else if (!link.startsWith('http')) await fs.access(link);
}
function gifFrames(data) {
  let position = 13;
  if (data[10] & 128) position += 3 * (1 << ((data[10] & 7) + 1));
  let frames = 0;
  const skipBlocks = () => { while (data[position]) { position += data[position] + 1; } position++; };
  while (position < data.length) {
    const marker = data[position++];
    if (marker === 0x3b) break;
    if (marker === 0x21) { position++; skipBlocks(); }
    else if (marker === 0x2c) {
      frames++;
      const packed = data[position + 8]; position += 9;
      if (packed & 128) position += 3 * (1 << ((packed & 7) + 1));
      position++; skipBlocks();
    } else throw new Error(`Unexpected GIF block: ${marker}`);
  }
  return frames;
}
for (const [file, width, height, frames] of [
  ['assets/pal-hello.gif', 640, 320, 30],
  ['assets/care-loop.gif', 640, 320, 30],
  ['assets/quest-banner.gif', 960, 420, 48],
  ['assets/quest-route.gif', 960, 120, 32]
]) {
  const data = await fs.readFile(file);
  assert.equal(data.subarray(0, 6).toString(), 'GIF89a');
  assert.equal(data.readUInt16LE(6), width); assert.equal(data.readUInt16LE(8), height);
  assert.equal(gifFrames(data), frames, `${file}: animated frame count`);
  assert(data.includes(Buffer.from('NETSCAPE2.0')), `${file} must loop`);
  assert(data.length > 10000, `${file} must contain animation data`);
}
const css = await fs.readFile('guide/styles.css', 'utf8');
assert(css.includes('tailwindcss') && css.includes('.grid') && css.includes('.pet-card'));
const readme = await fs.readFile('README.md', 'utf8');
assert(!readme.includes('](README.html)'), 'README launch must not lead into GitHub’s HTML source viewer');
assert(readme.includes('href="#launch-the-interactive-guide"') && readme.includes('## Launch the interactive guide'));
const entry = await fs.readFile('index.html', 'utf8');
assert(entry.includes('README.html') && entry.includes('location.replace'));
const workflow = await fs.readFile('.github/workflows/deploy-guide.yml', 'utf8');
for (const value of ['pages: write', 'id-token: write', 'actions/deploy-pages@v4', 'npm run check']) assert(workflow.includes(value));
console.log('Passed: matching brief content, local links, exact animated GIF frame counts, launch route, Pages workflow and compiled Tailwind.');
