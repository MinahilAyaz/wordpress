// Local dev server for the NESPORTS3 plugin.
//  /        -> renders the REAL plugin PHP templates through preview/render.php
//  /admin   -> simulated WordPress admin screen for the plugin's settings
//  /nesports-pro-store/* -> plugin static assets
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const PORT = 8000;
const ROOT = __dirname;
const PLUGIN_DIR = path.join(ROOT, 'nesports-pro-store');

let settings = {
    announcement_text: 'Free shipping on all orders',
    accent_color: '#e11d48',
    support_phone: '+1 (800) 555-0199',
    support_email: 'support@nesports3.com'
};

const mime = { '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ttf': 'font/ttf', '.woff': 'font/woff', '.woff2': 'font/woff2' };

function getLiveSettings() {
    const sFile = path.join(ROOT, 'preview', 'settings.json');
    if (fs.existsSync(sFile)) {
        try {
            const raw = fs.readFileSync(sFile, 'utf8');
            return Object.assign({}, settings, JSON.parse(raw));
        } catch(e){}
    }
    return settings;
}

function renderFrontend(page = 'home', extraEnv = {}) {
    return execFileSync('php', [path.join(ROOT, 'preview', 'render.php')], {
        env: { ...process.env, NES_SETTINGS: JSON.stringify(getLiveSettings()), NES_PAGE: page, ...extraEnv },
        encoding: 'utf8'
    });
}

function renderAdminPHP(req, res, postBody = '') {
    const u = new URL(req.url, `http://${req.headers.host}`);
    const query = u.search ? u.search.substring(1) : '';
    const env = {
        ...process.env,
        REQUEST_METHOD: req.method,
        QUERY_STRING: query,
        CONTENT_TYPE: req.headers['content-type'] || 'application/x-www-form-urlencoded',
        CONTENT_LENGTH: String(Buffer.byteLength(postBody || ''))
    };
    try {
        const output = execFileSync('php', [path.join(ROOT, 'preview', 'admin.php')], {
            input: postBody || '',
            env: env,
            encoding: 'utf8'
        });
        if (output.includes('Location: ')) {
            const loc = output.match(/Location:\s*([^\r\n]+)/);
            if (loc && loc[1]) {
                res.writeHead(302, { 'Location': loc[1].trim() });
                return res.end();
            }
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(output);
    } catch(e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Admin PHP error:\n' + (e.stderr || e.message));
    }
}

http.createServer((req, res) => {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'POST' && pathname === '/api/settings') {
        let body = '';
        req.on('data', c => (body += c));
        req.on('end', () => {
            try { Object.assign(settings, JSON.parse(body)); res.writeHead(200); res.end('{"success":true}'); }
            catch (e) { res.writeHead(400); res.end('{"success":false}'); }
        });
        return;
    }

        if (pathname === '/admin' || pathname === '/wp-admin' || pathname === '/options.php' || pathname === '/admin.php') {
        let body = '';
        req.on('data', c => (body += c));
        req.on('end', () => {
            renderAdminPHP(req, res, body);
        });
        return;
    }

    let cleanPath = decodeURIComponent(pathname);
    if (cleanPath.startsWith('/wp-content/plugins/nesports-pro-store/')) {
        cleanPath = cleanPath.replace('/wp-content/plugins', '');
    }

    if (cleanPath.startsWith('/nesports-pro-store/')) {
        const relative = cleanPath.replace(/^\/nesports-pro-store\//, '');
        const file = path.normalize(path.join(PLUGIN_DIR, relative));
        if (file.startsWith(PLUGIN_DIR) && fs.existsSync(file) && fs.statSync(file).isFile()) {
            const ext = path.extname(file).toLowerCase();
            res.setHeader('Access-Control-Allow-Origin', '*');
            if (ext === '.css' || ext === '.js') {
                res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            } else {
                res.setHeader('Cache-Control', 'public, max-age=86400');
            }
            res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
            return fs.createReadStream(file).pipe(res);
        }
        res.writeHead(404);
        return res.end('Not found');
    }

    try {
        let page = 'home';
        let extraEnv = {};

        if (pathname.includes('contact')) {
            page = 'contact';
        } else if (pathname.includes('story') || pathname.includes('about')) {
            page = 'about';
        } else if (pathname.startsWith('/product/')) {
            page = 'product';
            const slug = pathname.replace('/product/', '').replace(/\/$/, '');
            extraEnv.NES_SLUG = slug;
        } else if (pathname.startsWith('/product-category/') || pathname.startsWith('/category/') || pathname === '/shop' || pathname === '/shop/') {
            page = 'category';
            let cat = 'all';
            if (pathname.startsWith('/product-category/')) {
                cat = pathname.replace('/product-category/', '').replace(/\/$/, '');
            } else if (pathname.startsWith('/category/')) {
                cat = pathname.replace('/category/', '').replace(/\/$/, '');
            }
            extraEnv.NES_CAT = cat;
        } else if (pathname.includes('sizing')) {
            res.writeHead(302, { 'Location': '/shop/' });
            return res.end();
        }

        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderFrontend(page, extraEnv));
    } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('PHP render error:\n' + (e.stderr || e.message));
    }
}).listen(PORT, () => {
    console.log(`NESPORTS3 preview: http://localhost:${PORT}/  |  admin: http://localhost:${PORT}/admin`);
});
