const fs = require('fs');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

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
async function req(url, options = {}) {
    options.headers = options.headers || {};
    const cookie = getCookieHeader();
    if (cookie) options.headers['Cookie'] = cookie;
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36';
    const res = await fetch(url, { ...options, redirect: 'manual' });
    updateCookies(res);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        let nextUrl = res.headers.get('location');
        if (!nextUrl.startsWith('http')) nextUrl = new URL(nextUrl, url).href;
        return await req(nextUrl, { method: 'GET' });
    }
    return res;
}

(async () => {
    console.log('Logging in...');
    await req(SITE + '/wp-login.php');
    const p = new URLSearchParams();
    p.append('log', USER);
    p.append('pwd', PASS);
    p.append('rememberme', 'forever');
    p.append('wp-submit', 'Log In');
    await req(SITE + '/wp-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: p.toString()
    });

    console.log('Getting post 4400 Elementor full page...');
    const r = await req(SITE + '/wp-admin/post.php?post=4400&action=elementor');
    const html = await r.text();
    fs.writeFileSync('scratch/full_elementor_4400.html', html, 'utf8');

    // Find nonces
    const nonceMatches = [...html.matchAll(/"([a-zA-Z0-9_-]*nonce[a-zA-Z0-9_-]*)":\s*"([^"]+)"/gi)];
    console.log('All nonce matches found:', nonceMatches.map(m => m[1] + '=' + m[2]));

    // Check if elementor-editor.min.js or similar is loaded
    const scriptUrls = [...html.matchAll(/src='([^']*elementor[^']*)'/gi)].map(m => m[1]);
    console.log('Elementor script URLs count:', scriptUrls.length);
})();
