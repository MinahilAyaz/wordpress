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
    console.log("Logging into WP Admin with USER/PASS...");
    await request(SITE + '/wp-login.php');
    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('wp-submit', 'Log In');
    const loginRes = await request(SITE + '/wp-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
    });
    console.log("Login HTTP Status:", loginRes.status);

    console.log("Fetching Store Products Manager page: /wp-admin/admin.php?page=nesports-store-products ...");
    const pRes = await request(SITE + '/wp-admin/admin.php?page=nesports-store-products');
    console.log("Manager page HTTP status:", pRes.status);
    const pHtml = await pRes.text();
    
    console.log("Has 'Product & Price Manager' title:", pHtml.includes('Product & Price Manager'));
    console.log("Has 'Add New Product' modal button:", pHtml.includes('+ Add New Product'));
    console.log("Has 'Save Price' buttons:", pHtml.includes('Save Price'));
    console.log("Has 'Delete' buttons:", pHtml.includes('Delete'));
    
    const rowCount = (pHtml.match(/class="nesports-prod-row"/g) || []).length;
    console.log("Total products displayed in Manager table:", rowCount);
})();
