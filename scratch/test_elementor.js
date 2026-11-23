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

    console.log('Checking posts...');
    const r4400 = await req(SITE + '/wp-admin/post.php?post=4400&action=edit');
    console.log('Post 4400 edit status:', r4400.status);
    const html4400 = await r4400.text();
    const titleMatch = html4400.match(/<title>(.*?)<\/title>/);
    console.log('Post 4400 title:', titleMatch ? titleMatch[1] : 'unknown');

    const r1038 = await req(SITE + '/wp-admin/post.php?post=1038&action=edit');
    console.log('Post 1038 edit status:', r1038.status);
    const html1038 = await r1038.text();
    const title1038 = html1038.match(/<title>(.*?)<\/title>/);
    console.log('Post 1038 title:', title1038 ? title1038[1] : 'unknown');

    const el4400 = await req(SITE + '/wp-admin/post.php?post=4400&action=elementor');
    console.log('Post 4400 elementor status:', el4400.status);
    const elHtml = await el4400.text();
    fs.writeFileSync('scratch/el4400.html', elHtml.slice(0, 5000));
    console.log('Elementor HTML length:', elHtml.length);
})();
