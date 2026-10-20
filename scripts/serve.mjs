import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.gif': 'image/gif', '.md': 'text/plain; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const relative = decodeURIComponent(url.pathname === '/' ? '/README.html' : url.pathname);
    if (relative.split('/').some(part => part.startsWith('.') || part === 'node_modules')) { res.writeHead(403); res.end('Forbidden'); return; }
    const target = path.resolve(root, `.${relative}`);
    const within = path.relative(root, target);
    if (within.startsWith('..') || path.isAbsolute(within)) { res.writeHead(403); res.end('Forbidden'); return; }
    const file = await fs.readFile(target);
    res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' }); res.end(file);
  } catch { res.writeHead(404); res.end('Not found'); }
});
server.listen(4173, '127.0.0.1', () => console.log('Pocket Pal guide: http://127.0.0.1:4173'));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
export { server };
