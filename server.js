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

const mime = { '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp' };

function renderFrontend(page = 'home', extraEnv = {}) {
    return execFileSync('php', [path.join(ROOT, 'preview', 'render.php')], {
        env: { ...process.env, NES_SETTINGS: JSON.stringify(settings), NES_PAGE: page, ...extraEnv },
        encoding: 'utf8'
    });
}

function renderAdmin() {
    const css = fs.readFileSync(path.join(PLUGIN_DIR, 'assets', 'css', 'nesports-admin.css'), 'utf8');
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>NESPORTS3 - Admin</title>
<style>
body{background:#f0f0f1;margin:0;font-family:-apple-system,Segoe UI,Roboto,sans-serif}
.bar{background:#1d2327;color:#c3c4c7;height:32px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;font-size:13px}
.bar a{color:#c3c4c7;text-decoration:none}
.layout{display:flex;min-height:calc(100vh - 32px)}
.side{width:170px;background:#1d2327;padding-top:10px;flex-shrink:0}
.side a{display:block;padding:10px 16px;font-size:13px;color:#c3c4c7;text-decoration:none}
.side a.on{background:#e11d48;color:#fff;font-weight:700}
.main{flex:1;padding:24px 30px}
${css}
.button{display:inline-block;font-size:13px;min-height:30px;line-height:28px;padding:0 12px;border-radius:3px;cursor:pointer;border:1px solid #dcdcde;background:#f6f7f7;color:#2c3338;text-decoration:none}
.button-primary{background:#e11d48;border-color:#e11d48;color:#fff}
.widefat{width:100%;padding:8px 10px;border:1px solid #8c8f94;border-radius:4px}
.ok{display:none;background:#e6f4ea;border-left:4px solid #34a853;padding:12px 16px;margin-bottom:16px;border-radius:4px;color:#137333;font-weight:600}
</style></head><body>
<div class="bar"><div><strong>NESPORTS3</strong> &bull; <a href="/" target="_blank">Visit storefront</a></div><div>Howdy, Admin</div></div>
<div class="layout"><aside class="side"><a>Dashboard</a><a>WooCommerce</a><a>Pages</a><a class="on" href="/admin">NE Sports Store</a><a>Settings</a></aside>
<main class="main"><div class="nesports-admin-wrap">
<div class="nesports-admin-header"><div class="nesports-brand"><span class="nesports-badge">NESPORTS3</span><h1>STORE <span>SETTINGS</span></h1><p>Controls for the storefront top bar, accent colour and contact details.</p></div>
<div class="nesports-quick-actions"><a class="button" href="/" target="_blank">View live store</a></div></div>
<div class="ok" id="ok">Saved. Refresh the storefront to see it.</div>
<div class="nesports-card"><div class="nesports-card-header"><h2>Storefront</h2></div><div class="nesports-card-body">
<div class="nesports-form-group"><label><strong>Top bar announcement</strong></label><input class="widefat" id="announcement_text" value="${esc(settings.announcement_text)}"></div>
<div class="nesports-form-group"><label><strong>Support phone</strong></label><input class="widefat" id="support_phone" value="${esc(settings.support_phone)}"></div>
<div class="nesports-form-group"><label><strong>Support email</strong></label><input class="widefat" id="support_email" value="${esc(settings.support_email)}"></div>
<div class="nesports-form-group"><label><strong>Accent colour</strong></label><input type="color" id="accent_color" value="${esc(settings.accent_color)}"></div>
<button class="button button-primary" onclick="save()">Save settings</button></div></div></div></main></div>
<script>
function save(){var d={};['announcement_text','support_phone','support_email','accent_color'].forEach(function(k){d[k]=document.getElementById(k).value});
fetch('/api/settings',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}).then(function(){var o=document.getElementById('ok');o.style.display='block';setTimeout(function(){o.style.display='none'},3000)})}
</script></body></html>`;
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

    if (pathname === '/admin' || pathname === '/wp-admin') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end(renderAdmin());
    }

    if (pathname.startsWith('/nesports-pro-store/')) {
        const file = path.normalize(path.join(ROOT, pathname));
        if (file.startsWith(PLUGIN_DIR) && fs.existsSync(file) && fs.statSync(file).isFile()) {
            res.writeHead(200, { 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' });
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
            page = 'sizing';
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
