const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, '..', 'server.js');
let content = fs.readFileSync(serverFile, 'utf8');

const newAdminFunc = `function renderAdminPHP(req, res, postBody = '') {
    const u = new URL(req.url, \`http://\${req.headers.host}\`);
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
            const loc = output.match(/Location:\\s*([^\\r\\n]+)/);
            if (loc && loc[1]) {
                res.writeHead(302, { 'Location': loc[1].trim() });
                return res.end();
            }
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(output);
    } catch(e) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Admin PHP error:\\n' + (e.stderr || e.message));
    }
}`;

content = content.replace(/function renderAdmin\(\)\s*\{[\s\S]*?^}/m, newAdminFunc);

const routeReplacement = `    if (pathname === '/admin' || pathname === '/wp-admin' || pathname === '/options.php' || pathname === '/admin.php') {
        let body = '';
        req.on('data', c => (body += c));
        req.on('end', () => {
            renderAdminPHP(req, res, body);
        });
        return;
    }`;

content = content.replace(
    /if\s*\(\s*pathname\s*===\s*['"]\/admin['"]\s*\|\|\s*pathname\s*===\s*['"]\/wp-admin['"]\s*\)\s*\{[\s\S]*?return res\.end\(renderAdmin\(\)\);\s*\}/,
    routeReplacement
);

fs.writeFileSync(serverFile, content, 'utf8');
console.log('Updated server.js to use renderAdminPHP!');
