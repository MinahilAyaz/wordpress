const fs = require('fs');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

const cookieJar = {};
function updateCookies(res) {
    const headers = res.headers.getSetCookie ? res.headers.getSetCookie() : [];
    if (!headers.length && res.headers.get('set-cookie')) {
        headers.push(res.headers.get('set-cookie'));
    }
    for (const raw of headers) {
        for (const part of raw.split(/,(?=[^;]+=)/)) {
            const first = part.split(';')[0].trim();
            const idx = first.indexOf('=');
            if (idx > 0) {
                cookieJar[first.substring(0, idx).trim()] = first.substring(idx + 1).trim();
            }
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
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

    const res = await fetch(url, { ...options, redirect: 'manual' });
    updateCookies(res);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        let nextUrl = res.headers.get('location');
        if (!nextUrl.startsWith('http')) {
            nextUrl = new URL(nextUrl, url).href;
        }
        return await request(nextUrl, { method: 'GET' });
    }
    return res;
}

(async () => {
    await request(SITE + '/wp-login.php');
    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('rememberme', 'forever');
    formParams.append('wp-submit', 'Log In');
    formParams.append('redirect_to', SITE + '/wp-admin/plugins.php');
    await request(SITE + '/wp-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
    });

    const pRes = await request(SITE + '/wp-admin/plugins.php');
    const html = await pRes.text();
    fs.writeFileSync('scratch/plugins_list.html', html, 'utf8');
    
    // Extract plugin names and statuses
    const pluginRows = html.match(/<tr[^>]+class="[^"]*(?:active|inactive)[^"]*"[^>]*data-plugin="([^"]+)"[^>]*>([\s\S]*?)<\/tr>/g) || [];
    console.log('Total plugins found:', pluginRows.length);
    for (const row of pluginRows) {
        const m = row.match(/data-plugin="([^"]+)"/);
        const nameM = row.match(/<strong class="plugin-name">([^<]+)<\/strong>/);
        const isActive = row.includes('class="active"');
        console.log(`${isActive ? '[ACTIVE]' : '[INACTIVE]'} ${nameM ? nameM[1] : ''} (${m ? m[1] : ''})`);
    }
})();
