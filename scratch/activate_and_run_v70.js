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

    // Check plugins list
    const plRes = await req(SITE + '/wp-admin/plugins.php');
    const plHtml = await plRes.text();

    // Find activate link for v70 or updater
    const matches = [...plHtml.matchAll(/href="([^"]*action=activate[^"]*plugin=([^"&]*v70[^"&]*)[^"]*)"/gi)];
    console.log("V70 activate matches:", matches.length);
    if (matches.length > 0) {
        let actUrl = matches[0][1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
        console.log("Activating V70 via:", actUrl);
        const r = await req(actUrl);
        console.log("Activation result status:", r.status);
    } else {
        console.log("Searching all updater plugins on page:");
        const allUpdaters = [...plHtml.matchAll(/data-plugin="([^"]*updater[^"]*)"/gi)].map(m => m[1]);
        console.log(allUpdaters);
    }

    // Now test apply_v70
    const applyRes = await req(SITE + '/?nesports_apply_v70=1');
    const text = await applyRes.text();
    console.log("apply_v70 text:", text.substring(0, 300));
})();
