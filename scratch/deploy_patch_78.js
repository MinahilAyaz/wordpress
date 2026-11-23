const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';
const BASE_DIR = path.resolve(__dirname, '..');
const PLUGIN_NAME = 'nesports-core-patch-78';
const UPDATER_DIR = path.join(__dirname, PLUGIN_NAME);
const UPDATER_ZIP = path.join(__dirname, `${PLUGIN_NAME}.zip`);

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
    console.log("1. Creating zip package for patch 78...");
    if (fs.existsSync(UPDATER_ZIP)) fs.rmSync(UPDATER_ZIP, { force: true });
    execSync(`powershell -ExecutionPolicy Bypass -File scratch\\make_zip.ps1 -sourceDir "${UPDATER_DIR}" -zipPath "${UPDATER_ZIP}"`, { cwd: BASE_DIR });

    console.log("2. Logging into WordPress...");
    await request(SITE + '/wp-login.php');
    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('rememberme', 'forever');
    formParams.append('wp-submit', 'Log In');
    await request(SITE + '/wp-login.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formParams.toString() });

    console.log("3. Uploading plugin...");
    const installRes = await request(SITE + '/wp-admin/plugin-install.php?tab=upload');
    const installHtml = await installRes.text();
    const nonceMatch = installHtml.match(/id="_wpnonce"\s+name="_wpnonce"\s+value="([^"]+)"/);
    if (!nonceMatch) {
        console.error("Could not find upload nonce!");
        return;
    }
    const nonce = nonceMatch[1];

    const fileBuffer = fs.readFileSync(UPDATER_ZIP);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="_wpnonce"\r\n\r\n${nonce}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="_wp_http_referer"\r\n\r\n/wp-admin/plugin-install.php?tab=upload\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="pluginzip"; filename="${PLUGIN_NAME}.zip"\r\n`;
    body += `Content-Type: application/zip\r\n\r\n`;

    const bodyPrefix = Buffer.from(body, 'utf-8');
    const bodySuffix = Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="install-plugin-submit"\r\n\r\nInstall Now\r\n--${boundary}--\r\n`, 'utf-8');
    const fullBody = Buffer.concat([bodyPrefix, fileBuffer, bodySuffix]);

    const uploadRes = await request(SITE + '/wp-admin/update.php?action=upload-plugin', {
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`
        },
        body: fullBody
    });
    const uploadHtml = await uploadRes.text();

    const activateMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*)"/);
    if (activateMatch) {
        let activateUrl = activateMatch[1].replace(/&amp;/g, '&');
        if (!activateUrl.startsWith('http')) activateUrl = SITE + '/wp-admin/' + activateUrl;
        console.log("4. Activating plugin at:", activateUrl);
        await request(activateUrl);
        console.log("Patch 78 Activated!");
    } else {
        console.log("Looking for overwrite/replace button...");
        const replaceMatch = uploadHtml.match(/href="([^"]*action=update-selected[^"]*)"/);
        if (replaceMatch) {
            let replaceUrl = replaceMatch[1].replace(/&amp;/g, '&');
            if (!replaceUrl.startsWith('http')) replaceUrl = SITE + '/wp-admin/' + replaceUrl;
            await request(replaceUrl);
            console.log("Overwritten and Activated!");
        }
    }

    console.log("5. Triggering Patch 78 Execution...");
    const ajaxRes = await request(SITE + '/wp-admin/admin-ajax.php?action=nesports_patch_78_action');
    const ajaxText = await ajaxRes.text();
    console.log("Patch 78 Result:", ajaxText.substring(0, 300));

    console.log("=== PATCH 78 DEPLOYED SUCCESSFULLY ===");
})();
