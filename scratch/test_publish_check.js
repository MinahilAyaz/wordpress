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
    console.log('Logging into WordPress...');
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

    console.log('Fetching post 1038...');
    const el1038 = await req(SITE + '/wp-admin/post.php?post=1038&action=elementor');
    const h1038 = await el1038.text();
    const m1038 = h1038.match(/"status":"([^"]+)"/g);
    console.log('Post 1038 status occurrences:', m1038);

    console.log('Fetching post 4400...');
    const el4400 = await req(SITE + '/wp-admin/post.php?post=4400&action=elementor');
    const h4400 = await el4400.text();
    const m4400 = h4400.match(/"status":"([^"]+)"/g);
    console.log('Post 4400 status occurrences:', m4400);

    console.log('Fetching post 30090...');
    const el30090 = await req(SITE + '/wp-admin/post.php?post=30090&action=elementor');
    const h30090 = await el30090.text();
    const m30090 = h30090.match(/"status":"([^"]+)"/g);
    console.log('Post 30090 status occurrences:', m30090);

    // Let's check nonces and ajax
    const nonceMatch = h4400.match(/"nonces":\{([^}]+)\}/);
    console.log('Nonces match:', nonceMatch ? nonceMatch[1] : 'none');
})();
