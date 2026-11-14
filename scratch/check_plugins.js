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
async function req(url, opt={}) {
    opt.headers = opt.headers || {};
    const c = Object.entries(cookieJar).map(([k,v])=>k+'='+v).join('; ');
    if (c) opt.headers['Cookie'] = c;
    opt.headers['User-Agent'] = 'Mozilla/5.0';
    opt.redirect = 'manual';
    let res = await fetch(url, opt);
    updateCookies(res);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        let loc = res.headers.get('location');
        return req(loc.startsWith('http') ? loc : new URL(loc, url).toString(), {method:'GET'});
    }
    return res;
}
(async () => {
    await req(SITE + '/wp-login.php');
    await req(SITE + '/wp-login.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({log:USER, pwd:PASS, 'wp-submit':'Log In', redirect_to:SITE+'/wp-admin/', testcookie:'1'}).toString()
    });
    const pRes = await req(SITE + '/wp-admin/plugins.php');
    const html = await pRes.text();
    const rows = html.match(/<tr[^>]*data-plugin="([^"]+)"[^>]*>[\s\S]*?<\/tr>/g) || [];
    rows.forEach(r => {
        const id = r.match(/data-plugin="([^"]+)"/)?.[1];
        const active = r.includes('class="active');
        const name = r.match(/<td class="plugin-title[^>]*><strong>(.*?)<\/strong>/)?.[1];
        console.log({ id, name, active });
    });
})();
