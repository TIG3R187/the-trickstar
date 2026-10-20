import fs from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import gifenc from 'gifenc';
const { GIFEncoder, quantize, applyPalette } = gifenc;
const moods = {};
for (const mood of ['happy', 'sleeping', 'hungry']) {
  const svg = await fs.readFile(`assets/pal${mood === 'happy' ? '' : `-${mood}`}.svg`, 'utf8');
  moods[mood] = svg.match(/<g transform=[\s\S]*<\/g>/)[0];
}
const wrap = (body, width, height) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
const star = (x, y, r, color = '#b8f0ba') => `<path d="M${x - r} ${y}h${r * 2}M${x} ${y - r}v${r * 2}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
async function renderGif(name, width, height, frames, draw) {
  const gif = GIFEncoder();
  for (let i = 0; i < frames; i++) {
    const svg = wrap(draw(i, i / frames), width, height);
    const rendered = new Resvg(svg).render();
    const palette = quantize(rendered.pixels, 96);
    gif.writeFrame(applyPalette(rendered.pixels, palette), width, height, { palette, delay: 120, repeat: 0 });
    if (i === 0) await fs.writeFile(`assets/${name}-poster.png`, rendered.asPng());
  }
  gif.finish(); await fs.writeFile(`assets/${name}.gif`, gif.bytes());
  console.log(`Created ${name}.gif (${frames} frames).`);
}
await renderGif('quest-banner', 960, 420, 48, (i, t) => {
  const phase = Math.floor(i / 12);
  const bounce = Math.sin(t * Math.PI * 8) * (phase === 3 ? 3 : 10);
  const tilt = Math.sin(t * Math.PI * 8) * (phase === 2 ? 7 : 2);
  const mood = phase === 1 ? 'hungry' : phase === 3 ? 'sleeping' : 'happy';
  const labels = ['HELLO, QUADRI!', 'SNACK TIME', 'PLAY MODE: ON', 'DREAMING BIG'];
  const prop = ['✦', '♥', '✦', 'z z'][phase];
  return `<rect width="960" height="420" rx="24" fill="#142d29"/>
    <path d="M0 375Q280 320 500 385T960 360V420H0Z" fill="#203d34"/>
    <g opacity=".1" stroke="#c9f6bd">${Array.from({ length: 19 }, (_, j) => `<path d="M${j * 56} 0V420"/>`).join('')}${Array.from({ length: 9 }, (_, j) => `<path d="M0 ${j * 56}H960"/>`).join('')}</g>
    <g font-family="Arial, sans-serif"><rect x="40" y="28" width="302" height="28" rx="14" fill="#b9edb6"/><text x="56" y="47" fill="#173b2a" font-size="11" font-weight="700" letter-spacing="2">QUADRI’S FIRST FLUTTER QUEST</text>
    <text x="38" y="135" fill="#f6f2df" font-size="72" font-weight="900" letter-spacing="-4">POCKET PAL<tspan fill="#eab782">.</tspan></text>
    <text x="42" y="180" fill="#c7d9c5" font-size="20">A tiny friend. An entire world built by you.</text>
    <text x="42" y="226" fill="#91b4a1" font-size="13">ADOPT IT. CARE FOR IT. CODE IT. SHIP IT.</text>
    <rect x="42" y="264" width="250" height="40" rx="9" fill="#ecc399"/><text x="60" y="289" fill="#203d2f" font-size="14" font-weight="800">YOUR ADVENTURE AWAITS</text>
    <text x="43" y="355" fill="#bdcdb8" font-size="13">14 DAYS</text><text x="145" y="355" fill="#bdcdb8" font-size="13">10 MISSIONS</text><text x="277" y="355" fill="#bdcdb8" font-size="13">1 LIVE GAME</text>
    <rect x="584" y="25" width="322" height="359" rx="35" fill="#345545" stroke="#749b75" stroke-width="2"/>
    <rect x="603" y="44" width="284" height="276" rx="23" fill="#e4edce"/>
    <path d="M603 280Q715 249 887 285V300Q887 320 867 320H623Q603 320 603 300Z" fill="#cadbaa"/>
    <text x="625" y="72" fill="#4d7250" font-size="10" font-weight="800" letter-spacing="2">${labels[phase]}</text>
    <g transform="translate(${619 + Math.sin(t * 6.28) * 2} ${80 + bounce}) rotate(${tilt} 126 137) scale(.70)">${moods[mood]}</g>
    <text x="${826 + Math.cos(t * 12.56) * 8}" y="${124 + Math.sin(t * 12.56) * 12}" fill="#d69070" font-size="29" font-weight="700">${prop}</text>
    ${[0, 1, 2, 3].map(n => `<circle cx="${694 + n * 34}" cy="351" r="${n === phase ? 9 : 5}" fill="${n === phase ? '#d9edb8' : '#6b8a6c'}"/>`).join('')}
    <text x="745" y="407" text-anchor="middle" fill="#8fac94" font-size="8" letter-spacing="1">CONCEPT ART / YOUR FLUTTER BUILD IS NEXT</text></g>
    ${star(531, 63 + Math.sin(t * 12.56) * 8, 7)}${star(935, 211 + Math.cos(t * 12.56) * 12, 8, '#e9ba82')}${star(538, 337, 5)}
    <circle cx="${520 + Math.sin(t * 6.28) * 7}" cy="278" r="3" fill="#d8e8bb"/>`;
});
await renderGif('quest-route', 960, 120, 32, (i, t) => {
  const x = 90 + t * 780;
  const nodes = [['01', 'ADOPT', 90], ['02', 'CARE', 350], ['03', 'REMEMBER', 610], ['04', 'SHIP', 870]];
  return `<rect width="960" height="120" rx="18" fill="#eef1e3"/><path d="M90 43H870" stroke="#c9d9ba" stroke-width="3" stroke-dasharray="5 9"/>
    <path d="M90 43H${x}" stroke="#52794c" stroke-width="3"/>
    <g font-family="Arial, sans-serif">${nodes.map(([n, title, cx]) => `<circle cx="${cx}" cy="43" r="21" fill="${x >= cx - 10 ? '#345940' : '#dbe5cc'}"/><text x="${cx}" y="48" text-anchor="middle" fill="${x >= cx - 10 ? '#f8f6e9' : '#52794c'}" font-size="11" font-weight="700">${n}</text><text x="${cx}" y="93" text-anchor="middle" fill="#35523a" font-size="12" font-weight="800" letter-spacing="2">${title}</text>`).join('')}</g>
    <circle cx="${x}" cy="43" r="7" fill="#e4a269" stroke="#fdf8ed" stroke-width="3"/>`;
});
for (const [name, text, fill, width] of [['launch', '▶  START YOUR QUEST', '#b9edb6', 220], ['brief', '↗  READ THE ASSIGNMENT', '#edc69e', 250], ['download', '↓  GET THE OFFLINE PACK', '#e4e9d7', 250]]) {
  await fs.writeFile(`assets/button-${name}.svg`, wrap(`<rect x="1" y="1" width="${width - 2}" height="46" rx="10" fill="${fill}" stroke="#648569"/><text x="${width / 2}" y="29" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="800" letter-spacing=".6" fill="#1f3c2c">${text}</text>`, width, 48));
}
console.log('Created GitHub-compatible image buttons and static animation posters.');
const notesPath = 'assets/README.md';
const notes = (await fs.readFile(notesPath, 'utf8')).replace(/\n## GitHub quest artwork[\s\S]*$/, '');
await fs.writeFile(notesPath, notes + '\n## GitHub quest artwork\n\n- quest-banner.gif: 48-frame animated console and pet banner, 960×420.\n- quest-route.gif: 32-frame animated build route, 960×120.\n- quest-banner-poster.png and quest-route-poster.png: static first-frame alternatives.\n- button-launch.svg, button-brief.svg and button-download.svg: local image buttons for GitHub Markdown.\n\nThese are original concept illustrations under the same reuse permission above. The HTML guide respects reduced-motion preferences and offers a Pause animation control.\n');
