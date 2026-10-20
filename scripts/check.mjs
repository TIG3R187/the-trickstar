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
for (const file of ['assets/pal-hello.gif', 'assets/care-loop.gif']) {
  const data = await fs.readFile(file);
  assert.equal(data.subarray(0, 6).toString(), 'GIF89a');
  assert.equal(data.readUInt16LE(6), 640); assert.equal(data.readUInt16LE(8), 320);
  assert(data.includes(Buffer.from('NETSCAPE2.0')), `${file} must loop`);
  assert(data.length > 10000, `${file} must contain animation data`);
}
const css = await fs.readFile('guide/styles.css', 'utf8');
assert(css.includes('tailwindcss') && css.includes('.grid') && css.includes('.pet-card'));
console.log('Passed: matching goals/rules/missions in both docs, rubric total, local links, GIFs and compiled Tailwind CSS.');
