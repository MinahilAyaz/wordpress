const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

const BASE_DIR = path.resolve(__dirname, '..');

const cookieJar = {};
function updateCookies(res) {
    const headers = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    if (!headers.length && res.headers.get('set-cookie')) headers.push(res.headers.get('set-cookie'));
    for (const raw of headers) {
        for (const part of raw.split(/,(?=[^;]+=)/)) {
            const first = part.split(';')[0].trim();
            const idx = first.indexOf('=');
            if (idx > 0) cookieJar[first.substring(0, idx).trim()] = first.substring(idx + 1).trim();
        }
    }
}
function getCookieHeader() {
    return Object.entries(cookieJar).map(([k, v]) => k + '=' + v).join('; ');
}

async function request(url, options = {}) {
    options.headers = options.headers || {};
    const cookie = getCookieHeader();
    if (cookie) options.headers['Cookie'] = cookie;
    options.headers['User-Agent'] = 'Mozilla/5.0';
    const res = await fetch(url, { ...options, redirect: 'manual' });
    updateCookies(res);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        let nextUrl = res.headers.get('location');
        if (!nextUrl.startsWith('http')) nextUrl = new URL(nextUrl, url).href;
        return await request(nextUrl, { method: 'GET' });
    }
    return res;
}

(async () => {
    await request(SITE + '/wp-login.php');
    const formParams = new URLSearchParams({ log: USER, pwd: PASS, wp_submit: 'Log In' });
    await request(SITE + '/wp-login.php', { method: 'POST', body: formParams, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });

    const PLUGIN_NAME = 'nesports-core-patch-73';
    const patchPhp = '<?php\n' +
'/**\n' +
' * Plugin Name: NESports Core Patch 73\n' +
' * Version: 73.0\n' +
' */\n' +
'if (!defined("ABSPATH")) exit;\n\n' +
'add_action("init", function() {\n' +
'    // Auto forward any attempt to edit obsolete post 4400 to the official active post 30090\n' +
'    if (isset($_GET["post"]) && $_GET["post"] == 4400) {\n' +
'        $action = isset($_GET["action"]) ? $_GET["action"] : "edit";\n' +
'        wp_redirect(admin_url("post.php?post=30090&action=" . $action));\n' +
'        exit;\n' +
'    }\n' +
'}, 1);\n';

    const UPDATER_DIR = path.join(__dirname, PLUGIN_NAME);
    const UPDATER_ZIP = path.join(__dirname, `${PLUGIN_NAME}.zip`);
    if (fs.existsSync(UPDATER_DIR)) fs.rmSync(UPDATER_DIR, { recursive: true, force: true });
    if (fs.existsSync(UPDATER_ZIP)) fs.rmSync(UPDATER_ZIP, { force: true });
    fs.mkdirSync(UPDATER_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPDATER_DIR, `${PLUGIN_NAME}.php`), patchPhp, 'utf8');

    execSync(`powershell -ExecutionPolicy Bypass -File scratch\\make_zip.ps1 -sourceDir "${UPDATER_DIR}" -zipPath "${UPDATER_ZIP}"`, { cwd: BASE_DIR });

    const installRes = await request(SITE + '/wp-admin/plugin-install.php?tab=upload');
    const installHtml = await installRes.text();
    const nonceMatch = installHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
    const nonce = nonceMatch[1];

    const zipBuffer = fs.readFileSync(UPDATER_ZIP);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const crlf = '\r\n';
    let pre = `--${boundary}${crlf}Content-Disposition: form-data; name="_wpnonce"${crlf}${crlf}${nonce}${crlf}--${boundary}${crlf}Content-Disposition: form-data; name="_wp_http_referer"${crlf}${crlf}/wp-admin/plugin-install.php?tab=upload${crlf}--${boundary}${crlf}Content-Disposition: form-data; name="pluginzip"; filename="${PLUGIN_NAME}.zip"${crlf}Content-Type: application/zip${crlf}${crlf}`;
    let post = `${crlf}--${boundary}--${crlf}`;
    const body = Buffer.concat([Buffer.from(pre, 'utf8'), zipBuffer, Buffer.from(post, 'utf8')]);

    const uploadRes = await request(SITE + '/wp-admin/update.php?action=upload-plugin', {
        method: 'POST',
        headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
        body: body
    });
    const uploadHtml = await uploadRes.text();
    const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*)"/i);
    if (actMatch) {
        let actUrl = actMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
        await request(actUrl);
        console.log("Activated patch 73 successfully!");
    } else {
        const pRes = await request(SITE + '/wp-admin/plugins.php');
        const pHtml = await pRes.text();
        const m = pHtml.match(/href="([^"]*action=activate[^"]*plugin=nesports-core-patch-73[^"]*)"/i);
        if (m) {
            let actUrl = m[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
            await request(actUrl);
            console.log("Activated via plugins.php!");
        }
    }

    // Now test post 4400 elementor request with manual redirect
    const testRes = await fetch(SITE + '/wp-admin/post.php?post=4400&action=elementor', {
        headers: { 'Cookie': getCookieHeader(), 'User-Agent': 'Mozilla/5.0' },
        redirect: 'manual'
    });
    console.log("Status code on post 4400:", testRes.status);
    console.log("Redirect location:", testRes.headers.get('location'));
})();
