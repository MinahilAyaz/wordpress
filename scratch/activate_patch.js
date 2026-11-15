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
    // 1. Login
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

    // 2. Fetch plugins.php and find activation link for nesports-patch
    const pRes = await request(SITE + '/wp-admin/plugins.php');
    const pHtml = await pRes.text();

    const regex = /href="([^"]*action=activate[^"]*plugin=nesports-patch[^"]*)"/g;
    let match;
    let actUrls = [];
    while ((match = regex.exec(pHtml)) !== null) {
        actUrls.push(match[1].replace(/&amp;/g, '&'));
    }

    if (actUrls.length === 0) {
        console.log('No inactive nesports-patch plugins found! Checking if already active:');
        const deactRegex = /href="([^"]*action=deactivate[^"]*plugin=nesports-patch[^"]*)"/g;
        while ((match = deactRegex.exec(pHtml)) !== null) {
            console.log('Already ACTIVE:', match[1]);
        }
    } else {
        // Activate the last one (most recent)
        const targetAct = actUrls[actUrls.length - 1];
        let fullActUrl = targetAct;
        if (!fullActUrl.startsWith('http')) fullActUrl = new URL(fullActUrl, SITE + '/wp-admin/').href;
        console.log('Activating plugin via:', fullActUrl);
        const actRes = await request(fullActUrl);
        console.log('Activation HTTP status:', actRes.status);
    }

    // 3. Trigger run_nesports_patch=1
    console.log('Calling ?run_nesports_patch=1...');
    const trigRes = await request(SITE + '/?run_nesports_patch=1');
    const trigText = await trigRes.text();
    console.log('Response status:', trigRes.status);
    console.log('Response content (first 500 chars):', trigText.slice(0, 500));
})();
