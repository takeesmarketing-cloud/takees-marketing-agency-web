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

  // Pages are served at clean addresses (/, /about, /bangalore …),
  // mirroring the rules in .htaccess
  const redirect = (to) => {
    res.writeHead(301, { Location: to });
    res.end();
  };
  const isPage = (name) => fs.existsSync(path.join(__dirname, `${name}.html`));
  const oldAddresses = {
    'about-takees-marketing': '/about',
    'digital-marketing-services': '/services',
    'digital-marketing-company-achievements': '/achievements',
    'contact-takees-marketing-company': '/contact',
    'best-digital-marketing-agency-in-bangalore': '/blog-details'
  };

  // The home page is served at / only
  if (reqUrl === '/index.html') return redirect('/');
  // Old folder addresses: /bangalore/ and /bangalore/index.html → /bangalore
  const folder = reqUrl.match(/^\/(bangalore|kochi)\/(index\.html)?$/);
  if (folder) return redirect(`/${folder[1]}`);
  // The Method page was removed; old links go to About Us
  if (/^\/((bangalore|kochi)\/)?method\.html$/.test(reqUrl)) return redirect('/about');
  // Old folder pages (/bangalore/about.html …) → the shared page
  const folderPage = reqUrl.match(/^\/(?:bangalore|kochi)\/([a-z-]+)\.html$/);
  if (folderPage) return redirect(`/${folderPage[1]}`);

  const page = reqUrl.match(/^\/([a-z-]+)(\.html|\/)?$/);
  if (page) {
    const [, name, suffix] = page;
    if (oldAddresses[name]) return redirect(oldAddresses[name]);
    if (isPage(name)) {
      if (suffix) return redirect(`/${name}`);
      reqUrl = `/${name}.html`;
    }
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
