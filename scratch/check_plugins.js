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
    options.redirect = 'manual';
    let res = await fetch(url, options);
    updateCookies(res);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        let loc = res.headers.get('location');
        if (!loc.startsWith('http')) loc = new URL(loc, url).href;
        return request(loc, { method: 'GET' });
    }
    return res;
}

(async () => {
    const loginPageRes = await request(SITE + '/wp-login.php');
    await loginPageRes.text();
    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('rememberme', 'forever');
    formParams.append('wp-submit', 'Log In');
    formParams.append('redirect_to', SITE + '/wp-admin/plugins.php');
    const loginRes = await request(SITE + '/wp-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
    });
    const pluginsHtml = await loginRes.text();
    
    // Find active plugin rows containing nesports
    const rows = pluginsHtml.split('<tr');
    for (const r of rows) {
        if (r.toLowerCase().includes('nesports')) {
            const pMatch = r.match(/data-plugin="([^"]+)"/);
            const classMatch = r.match(/class="([^"]+)"/);
            const actMatch = r.match(/href="([^"]*action=activate[^"]*)"/);
            const deactMatch = r.match(/href="([^"]*action=deactivate[^"]*)"/);
            console.log('---');
            if (pMatch) console.log('Plugin:', pMatch[1]);
            if (classMatch) console.log('Classes:', classMatch[1]);
            if (deactMatch) console.log('ACTIVE! Deactivate link:', deactMatch[1].replace(/&amp;/g, '&'));
            if (actMatch) console.log('INACTIVE! Activate link:', actMatch[1].replace(/&amp;/g, '&'));
        }
    }
})();
