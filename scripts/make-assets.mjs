import fs from 'node:fs/promises';
import { Resvg } from '@resvg/resvg-js';
import gifenc from 'gifenc';
const { GIFEncoder, quantize, applyPalette } = gifenc;
await fs.mkdir('assets', { recursive: true });

function pal({ x = 0, y = 0, scale = 1, blink = false, mood = 'happy', wave = 0 } = {}) {
  const eyes = blink || mood === 'sleeping' || mood === 'tired'
    ? '<path d="M-39 -3q9 10 18 0m24 0q9 10 18 0" fill="none" stroke="#243e35" stroke-width="6" stroke-linecap="round"/>'
    : '<ellipse cx="-29" cy="-1" rx="6" ry="9" fill="#243e35"/><ellipse cx="14" cy="-1" rx="6" ry="9" fill="#243e35"/>';
  const mouth = mood === 'hungry'
    ? '<ellipse cx="-7" cy="26" rx="8" ry="10" fill="#243e35"/>'
    : mood === 'sleeping'
    ? '<path d="M-15 25h15" stroke="#243e35" stroke-width="5" stroke-linecap="round"/>'
    : mood === 'sad' || mood === 'tired'
    ? '<path d="M-20 30q13 -13 26 0" fill="none" stroke="#243e35" stroke-width="5" stroke-linecap="round"/>'
    : '<path d="M-20 21q13 17 26 0" fill="none" stroke="#243e35" stroke-width="5" stroke-linecap="round"/>';
  return `<g transform="translate(${x} ${y}) scale(${scale})">
    <ellipse cx="0" cy="91" rx="81" ry="12" fill="#263d31" opacity=".09"/>
    <path d="M-63 42q-46 -9 -31 -36q9 -10 27 14" fill="#84d4ae" stroke="#316b50" stroke-width="3"/>
    <path d="M67 32q45 ${-25 - wave} 33 ${-48 - wave}q-14 -10 -32 24" fill="#84d4ae" stroke="#316b50" stroke-width="3"/>
    <path d="M-41 68q-18 36 -40 16q-8 -14 19 -30m85 14q14 35 39 17q12 -13 -16 -32" fill="#64bc96" stroke="#316b50" stroke-width="3"/>
    <path d="M-87 5C-85 -65 -58 -91 -7 -88C46 -98 80 -58 83 6C92 64 59 82 -5 81C-67 85 -95 61 -87 5Z" fill="#97dfb8" stroke="#316b50" stroke-width="3.5"/>
    <path d="M-68 -25q10 -43 51 -43" fill="none" stroke="#c9f3d8" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="-7" cy="46" rx="40" ry="24" fill="#b8edca"/>
    <path d="M-5 -86q-9 -36 5 -48" fill="none" stroke="#316b50" stroke-width="5" stroke-linecap="round"/>
    <path d="M-4 -105q-35 -3 -33 -30q34 -4 33 30" fill="#58a46f" stroke="#316b50" stroke-width="3"/>
    <path d="M-2 -115q-2 -30 32 -34q7 28 -32 34" fill="#8fc86c" stroke="#316b50" stroke-width="3"/>
    <ellipse cx="-49" cy="17" rx="12" ry="7" fill="#ed9e91" opacity=".8"/><ellipse cx="36" cy="17" rx="12" ry="7" fill="#ed9e91" opacity=".8"/>
    ${eyes}${mouth}
    ${mood === 'sleeping' ? '<text x="76" y="-76" fill="#316b50" font-family="Arial" font-size="27" font-weight="700">z z</text>' : ''}
  </g>`;
}
const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><title>Pocket Pal game icon</title><desc>An original friendly mint creature with a leafy sprout, rosy cheeks and a smile.</desc><rect width="512" height="512" rx="120" fill="#fbf5e9"/><circle cx="256" cy="279" r="180" fill="#e1efcf"/><path d="M395 96v28m-14 -14h28M95 180v20m-10 -10h20" stroke="#e5aa44" stroke-width="7" stroke-linecap="round"/>${pal({ x: 263, y: 294, scale: 1.57 })}</svg>`;
await fs.writeFile('assets/pocket-pal-icon.svg', icon);
await fs.writeFile('assets/pocket-pal-icon.png', new Resvg(icon).render().asPng());
// A transparent vector is useful as the editable mascot in the HTML playground.
await fs.writeFile('assets/pal.svg', `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="330" viewBox="0 0 360 330"><title>Pocket Pal mascot</title>${pal({ x: 180, y: 196, scale: 1.25 })}</svg>`);
for (const mood of ['hungry', 'sleeping', 'tired', 'sad']) {
  await fs.writeFile(`assets/pal-${mood}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="330" viewBox="0 0 360 330"><title>Pocket Pal: ${mood}</title>${pal({ x: 180, y: 196, scale: 1.25, mood })}</svg>`);
}

for (const mode of ['hello', 'care']) {
  const gif = GIFEncoder();
  const frames = 30;
  for (let i = 0; i < frames; i++) {
    const phase = Math.floor(i / 10);
    const mood = mode === 'care' ? ['hungry', 'happy', 'sleeping'][phase] : 'happy';
    const title = mode === 'hello' ? 'Hey, Quadri.' : ['A snack, please.', 'Let’s play!', 'Time to recharge.'][phase];
    const subtitle = mode === 'hello' ? 'Your next adventure has a tiny heartbeat.' : ['Feed · hunger goes down', 'Play · happiness goes up', 'Sleep · energy recovers'][phase];
    const bounce = Math.sin(i / frames * Math.PI * 4) * 6;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="320"><rect width="640" height="320" rx="28" fill="#f7f2e7"/><circle cx="472" cy="166" r="124" fill="#e0edcf"/><g font-family="Arial, sans-serif" fill="#233c30"><text x="38" y="75" font-size="12" letter-spacing="3" font-weight="700">POCKET PAL / CONCEPT</text><text x="38" y="137" font-size="31" font-weight="700">${title}</text><text x="38" y="174" font-size="14">${subtitle}</text><rect x="38" y="212" width="180" height="37" rx="18" fill="#e8aa6d"/><text x="57" y="236" font-size="13" font-weight="700">Small steps. Real progress.</text></g>${pal({ x: 483, y: 187 + bounce, scale: 1, blink: i % 15 === 0, mood, wave: Math.sin(i) * 8 })}</svg>`;
    const rendered = new Resvg(svg).render();
    const pixels = rendered.pixels;
    const palette = quantize(pixels, 128);
    const indexed = applyPalette(pixels, palette);
    gif.writeFrame(indexed, 640, 320, { palette, delay: 100, repeat: 0 });
  }
  gif.finish();
  await fs.writeFile(`assets/${mode === 'hello' ? 'pal-hello' : 'care-loop'}.gif`, gif.bytes());
}
await fs.writeFile('assets/README.md', `# Pocket Pal artwork\n\nOriginal artwork created for Quadri’s assignment. You may copy, adapt and redistribute these assets as part of the assignment, the finished game and your portfolio.\n\n- pocket-pal-icon.svg: editable 512×512 vector game icon.\n- pocket-pal-icon.png: 512×512 raster icon, suitable for Flutter Image.asset.\n- pal.svg: transparent vector mascot for the guide.\n- pal-hello.gif: looping welcome illustration, 640×320.\n- care-loop.gif: looping care concept, 640×320.\n\nThe GIFs are concept illustrations, not screen recordings of a finished Flutter game. Generate them again with npm run assets. No third-party character artwork is included.\n\nTo use the PNG in Flutter, copy it into app/assets/images/, declare that directory under flutter/assets in app/pubspec.yaml, and load it with Image.asset. For platform launcher icons, generate the platform-specific sizes separately.\n`);
console.log('Created original SVG, PNG and two 30-frame GIFs.');
