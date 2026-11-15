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
    const pHtml = await pRes.text();

    // Deactivate zuubitmvFTwJ2xCa if active
    const deactMatch = pHtml.match(/href="([^"]*action=deactivate[^"]*plugin=nesports-updater-zuubitmvFTwJ2xCa[^"]*)"/);
    if (deactMatch) {
        let deactUrl = deactMatch[1].replace(/&amp;/g, '&');
        if (!deactUrl.startsWith('http')) deactUrl = new URL(deactUrl, SITE + '/wp-admin/').href;
        console.log('Deactivating old updater:', deactUrl);
        await request(deactUrl);
    }

    // Activate mxHtZTiEHmh1bHFO
    const pRes2 = await request(SITE + '/wp-admin/plugins.php');
    const pHtml2 = await pRes2.text();
    const actMatch = pHtml2.match(/href="([^"]*action=activate[^"]*plugin=nesports-updater-mxHtZTiEHmh1bHFO[^"]*)"/);
    if (actMatch) {
        let actUrl = actMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
        console.log('Activating new updater:', actUrl);
        await request(actUrl);
    } else {
        console.log('mxHtZTiEHmh1bHFO already active or not found');
    }

    // Trigger update
    console.log('Triggering nesports_apply_update=1...');
    const trigRes = await request(SITE + '/?nesports_apply_update=1');
    const trigText = await trigRes.text();
    console.log('Result:', trigText);
})();
