const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0].replace(/%20/g, ' ');

  // Location pages live in the root (bangalore.html, kochi.html) and are
  // served at /bangalore and /kochi, mirroring the rules in .htaccess
  const redirect = (to) => {
    res.writeHead(301, { Location: to });
    res.end();
  };
  // The home page is served at / only
  if (reqUrl === '/index.html') return redirect('/');
  // The Method page was removed; old links go to About Us
  if (/^\/((bangalore|kochi)\/)?method\.html$/.test(reqUrl)) return redirect('/about.html');

  const location = reqUrl.match(/^\/(bangalore|kochi)(\/.*)?$/);
  if (location) {
    const [, city, rest] = location;
    if (rest === undefined) reqUrl = `/${city}.html`;
    else if (rest === '/' || rest === '/index.html') return redirect(`/${city}`);
    else if (/^\/[a-z-]+\.html$/.test(rest)) return redirect(rest);
  }
  if (reqUrl.endsWith('/')) reqUrl += 'index.html';

  const filePath = path.join(__dirname, reqUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Server Error');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
