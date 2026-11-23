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
async function request(url, options = {}) {
    options.headers = options.headers || {};
    const cookie = Object.entries(cookieJar).map(([k, v]) => k + '=' + v).join('; ');
    if (cookie) options.headers['Cookie'] = cookie;
    options.headers['User-Agent'] = 'Mozilla/5.0';
    const res = await fetch(url, { ...options, redirect: 'manual' });
    updateCookies(res);
    return res;
}

(async () => {
    await request(SITE + '/wp-login.php');
    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('rememberme', 'forever');
    formParams.append('wp-submit', 'Log In');
    await request(SITE + '/wp-login.php', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: formParams.toString() });

    // Check plugins.php
    const pRes = await request(SITE + '/wp-admin/plugins.php');
    const html = await pRes.text();
    const actLinks = [...html.matchAll(/href="([^"]*action=activate[^"]*plugin=[^"]*patch-75[^"]*)"/gi)];
    console.log("Patch 75 activate link on plugins.php:", actLinks.map(m => m[1]));
    if (actLinks.length > 0) {
        let actUrl = actLinks[0][1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
        console.log("Calling activation URL:", actUrl);
        const r = await request(actUrl);
        console.log("Status:", r.status, "Location:", r.headers.get('location'));
        const rText = await r.text();
        console.log("Snippet:", rText.substring(0, 300));
    }
})();
