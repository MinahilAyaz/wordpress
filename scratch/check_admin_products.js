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
async function request(url, options = {}) {
    options.headers = options.headers || {};
    const cookie = getCookieHeader();
    if (cookie) options.headers['Cookie'] = cookie;
    options.headers['User-Agent'] = 'Mozilla/5.0';
    let res = await fetch(url, { ...options, redirect: 'manual' });
    updateCookies(res);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        let nextUrl = res.headers.get('location');
        if (!nextUrl.startsWith('http')) nextUrl = new URL(nextUrl, url).href;
        return request(nextUrl, { method: 'GET' });
    }
    return res;
}

(async () => {
    await request(SITE + '/wp-login.php');
    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('wp-submit', 'Log In');
    await request(SITE + '/wp-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
    });

    const pRes = await request(SITE + '/wp-admin/edit.php?post_type=product');
    const pHtml = await pRes.text();
    
    const countMatch = pHtml.match(/class="count">\s*\(([0-9]+)\)/);
    console.log('Total products in WP admin:', countMatch ? countMatch[1] : 'Not found');

    const titles = [...pHtml.matchAll(/class="row-title"[^>]*>([^<]+)<\/a>/g)].map(m => m[1]);
    console.log('Product titles sample:', titles.slice(0, 10));
})();
