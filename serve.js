const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
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
  const articleRoutes = new Set([
    'instagram-carousel-captions',
    'instagram-instants',
    'meta-ads-new-targeting-update',
    'how-instagram-search-works',
    '70-20-10-rule-digital-marketing',
    'digital-marketing-results-timeline',
    'latest-instagram-updates',
    'purple-cow-marketing',
    'how-to-start-business-from-zero',
    'build-brand-through-social-media',
    'gemini-pro-for-jio-users'
  ]);
  const oldAddresses = {
    'about-takees-marketing': '/about',
    'about-takees-digital-marketing-agency-in-kannur-kerala': '/about',
    'about-takees-marketing-in-kannur-kerala': '/about',
    'digital-marketing-services': '/services',
    'services-of-takees-marketing-agency-kannur-kerala': '/services',
    'digital-marketing-company-achievements': '/achievements',
    'portfolio': '/achievements',
    'portfolio2': '/achievements',
    'vastragni-branding': '/achievements',
    'wgl-2': '/achievements',
    'branding-v': '/achievements',
    'contact-takees-marketing-company': '/contact',
    'contact-page-of-best-digital-marketing-agency-in-kannur': '/contact',
    'best-digital-marketing-agency-in-bangalore': '/blog-details',
    'best-digital-marketing-company-in-bangalore': '/bangalore',
    'best-digital-marketing-company-in-bangalore-takees': '/bangalore',
    'digital-marketing-company-in-bangalore': '/bangalore',
    'social-media-marketing-in-bangalore': '/bangalore',
    'website-developer-in-bangalore': '/bangalore',
    'digital-marketing-company-in-kannur': '/',
    'website-developer-in-kannur': '/',
    'social-media-marketing-for-small-businesses-in-kannur': '/',
    'latest-ai-tools-for-marketers-to-use-not-to-miss-it': '/ai-tools',
    'best-ai-tools-of-2026': '/ai-tools',
    'good-news-for-jio-users-to-get-gemini-pro-for-free': '/blogs/gemini-pro-for-jio-users',
    'how-does-instagram-search-engine-work-guide': '/blogs/how-instagram-search-works',
    'how-long-does-digital-marketing-take-to-show-results': '/blogs/digital-marketing-results-timeline',
    'how-to-build-a-brand-through-social-media-simple-guide': '/blogs/build-brand-through-social-media',
    'how-to-start-business-from-zero-a-practical-guide': '/blogs/how-to-start-business-from-zero',
    'instagram-carousel-captions': '/blogs/instagram-carousel-captions',
    'instagram-instants': '/blogs/instagram-instants',
    'latest-instagram-updates': '/blogs/latest-instagram-updates',
    'meta-ads-new-targeting-update': '/blogs/meta-ads-new-targeting-update',
    'purple-cow-theory-what-it-means': '/blogs/purple-cow-marketing',
    'what-is-70-20-10-rule-in-digital-marketing': '/blogs/70-20-10-rule-digital-marketing',
    'co-working-space-in-kannur-takees-park-kannur': 'https://takeescowork.com/'
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

  let isBlogArticleRoute = false;
  const blogArticle = reqUrl.match(/^\/blogs\/([a-z0-9-]+)(\/?)$/);
  if (blogArticle && articleRoutes.has(blogArticle[1])) {
    if (blogArticle[2]) return redirect(`/blogs/${blogArticle[1]}`);
    isBlogArticleRoute = true;
    reqUrl = '/blogs.html';
  }

  const page = reqUrl.match(/^\/([a-z0-9-]+)(\.html|\/)?$/);
  if (page && !isBlogArticleRoute) {
    const [, name, suffix] = page;
    if (oldAddresses[name]) return redirect(oldAddresses[name]);
    if (isPage(name)) {
      if (suffix) return redirect(`/${name}`);
      reqUrl = `/${name}.html`;
    }
  }
  // Any other old WordPress address (they all end with a slash) → the Blogs page
  if (reqUrl !== '/' && reqUrl.endsWith('/') && !fs.existsSync(path.join(__dirname, reqUrl))) {
    return redirect('/blogs');
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
