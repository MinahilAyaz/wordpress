const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Agent, setGlobalDispatcher } = require('undici');

// Configure global dispatcher with 30-minute timeout for large zip uploads
setGlobalDispatcher(new Agent({
    headersTimeout: 30 * 60 * 1000,
    bodyTimeout: 30 * 60 * 1000,
    connectTimeout: 60 * 1000
}));

const SITE = "https://www.nesports3.com";
const USER = "NESports";
const PASS = "NES3@1122$PK";

const BASE_DIR = __dirname;
const ZIP_PATH = path.join(BASE_DIR, "nesports-pro.zip");

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
                const k = first.substring(0, idx).trim();
                const v = first.substring(idx + 1).trim();
                cookieJar[k] = v;
            }
        }
    }
}

function getCookieHeader() {
    return Object.entries(cookieJar).map(([k, v]) => `${k}=${v}`).join('; ');
}

async function request(url, options = {}) {
    options.headers = options.headers || {};
    const cookie = getCookieHeader();
    if (cookie) {
        options.headers['Cookie'] = cookie;
    }
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
    options.redirect = 'manual';

    let res = await fetch(url, options);
    updateCookies(res);

    if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get('location');
        if (loc) {
            const nextUrl = loc.startsWith('http') ? loc : new URL(loc, url).toString();
            return request(nextUrl, { method: 'GET' });
        }
    }
    return res;
}

function createZip() {
    console.log("[1/4] Packing plugin into ZIP using PowerShell (forward slashes)...");
    execSync('powershell -ExecutionPolicy Bypass -File scratch/pack_forward.ps1', { stdio: 'inherit', cwd: BASE_DIR });
    if (!fs.existsSync(ZIP_PATH)) {
        throw new Error("ZIP creation failed!");
    }
}

async function deploy() {
    console.log(`[2/4] Logging in to WordPress at ${SITE}...`);
    // Seed test cookie
    await request(`${SITE}/wp-login.php`);

    const loginBody = new URLSearchParams({
        log: USER,
        pwd: PASS,
        'wp-submit': 'Log In',
        redirect_to: `${SITE}/wp-admin/`,
        testcookie: '1'
    });

    const loginRes = await request(`${SITE}/wp-login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: loginBody.toString()
    });

    const isAuthed = Object.keys(cookieJar).some(k => k.includes('wordpress_logged_in_'));
    if (!isAuthed) {
        console.error("ERROR: Login failed. Check credentials.");
        process.exit(1);
    }
    console.log("      Logged in successfully!");

    console.log("[3/4] Fetching upload nonce and submitting plugin zip...");
    const uploadPageRes = await request(`${SITE}/wp-admin/plugin-install.php?tab=upload`);
    const uploadHtml = await uploadPageRes.text();

    const mNonce = uploadHtml.match(/id="_wpnonce"\s+name="_wpnonce"\s+value="([^"]+)"/) ||
                   uploadHtml.match(/name="_wpnonce"\s+value="([^"]+)"/);
    if (!mNonce) {
        console.error("ERROR: Could not retrieve WordPress upload nonce.");
        process.exit(1);
    }
    const nonce = mNonce[1];
    console.log(`      Upload nonce retrieved: ${nonce}`);

    const zipBuffer = fs.readFileSync(ZIP_PATH);
    const form = new FormData();
    form.append('_wpnonce', nonce);
    form.append('_wp_http_referer', '/wp-admin/plugin-install.php?tab=upload');
    form.append('pluginzip', new Blob([zipBuffer], { type: 'application/zip' }), 'nesports-pro.zip');
    form.append('install-plugin-submit', 'Install Now');

    console.log("      Uploading nesports-pro.zip (" + (zipBuffer.length / (1024*1024)).toFixed(2) + " MB)...");
    const uploadRes = await request(`${SITE}/wp-admin/update.php?action=upload-plugin`, {
        method: 'POST',
        body: form
    });

    let resHtml = await uploadRes.text();

    // Check if overwrite confirmation is needed
    const mOverwrite = resHtml.match(/href="([^"]*overwrite=update-plugin[^"]*)"/);
    if (mOverwrite) {
        let owUrl = mOverwrite[1].replace(/&amp;/g, '&');
        if (!owUrl.startsWith('http')) {
            owUrl = `${SITE}/wp-admin/${owUrl.replace(/^\//, '')}`;
        }
        console.log("      Confirming replace current version...");
        const owRes = await request(owUrl);
        resHtml = await owRes.text();
    }

    console.log("[4/4] Activating plugin...");
    const mAct = resHtml.match(/href="([^"]*plugins\.php\?action=activate[^"]*)"/);
    if (mAct) {
        let actUrl = mAct[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) {
            actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
        }
        await request(actUrl);
    } else {
        const pluginsRes = await request(`${SITE}/wp-admin/plugins.php`);
        const phtml = await pluginsRes.text();
        const mAct2 = phtml.match(/href="([^"]*action=activate[^"]*nesports-pro%2Fnesports-pro-store\.php[^"]*)"/);
        if (mAct2) {
            let actUrl = mAct2[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) {
                actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
            }
            await request(actUrl);
        }
    }

    if (fs.existsSync(ZIP_PATH)) {
        fs.unlinkSync(ZIP_PATH);
    }

    console.log("\n========================================================");
    console.log("SUCCESS! Plugin successfully deployed and activated on https://www.nesports3.com!");
    console.log("========================================================\n");
}

(async () => {
    try {
        createZip();
        await deploy();
    } catch (e) {
        console.error("Deployment failed:", e);
        process.exit(1);
    }
})();
