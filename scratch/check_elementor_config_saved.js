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

    const r30090 = await req(SITE + '/wp-admin/post.php?post=30090&action=elementor');
    const h30090 = await r30090.text();
    const configMatch = h30090.match(/ElementorConfig\s*=\s*(\{[\s\S]*?\});/);
    if (configMatch) {
        const config = JSON.parse(configMatch[1]);
        const elements = config.initial_document.elements;
        console.log('Post 30090 elements JSON stringified length:', JSON.stringify(elements).length);
        const storyWidget = JSON.stringify(elements).match(/\{"id":"[^"]+","elType":"widget"[^}]*"widgetType":"nesports-story"[\s\S]*?\}/);
        console.log('Story widget in 30090 config snippet:', storyWidget ? storyWidget[0].substring(0, 300) : 'none');
    }

    const r4400 = await req(SITE + '/wp-admin/post.php?post=4400&action=elementor');
    const h4400 = await r4400.text();
    const configMatch4400 = h4400.match(/ElementorConfig\s*=\s*(\{[\s\S]*?\});/);
    if (configMatch4400) {
        const config4400 = JSON.parse(configMatch4400[1]);
        const elements4400 = config4400.initial_document.elements;
        console.log('Post 4400 elements JSON stringified length:', JSON.stringify(elements4400).length);
    }
})();
