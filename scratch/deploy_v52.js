const fs = require('fs');
const path = require('path');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

const ZIP_PATH = path.resolve(__dirname, 'nesports-updater-v52.zip');

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
async function request(url, options = {}, retries = 5) {
    options.headers = options.headers || {};
    const cookie = getCookieHeader();
    if (cookie) options.headers['Cookie'] = cookie;
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

    try {
        const res = await fetch(url, { ...options, redirect: 'manual' });
        updateCookies(res);
        if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
            let nextUrl = res.headers.get('location');
            if (!nextUrl.startsWith('http')) {
                nextUrl = new URL(nextUrl, url).href;
            }
            return await request(nextUrl, { method: 'GET' }, retries);
        }
        return res;
    } catch (err) {
        if (retries > 0) {
            console.log(`Fetch retry for ${url} (${err.message})`);
            await new Promise(r => setTimeout(r, 1500));
            return await request(url, options, retries - 1);
        }
        throw err;
    }
}

async function deploy() {
    console.log('[1/4] Logging in to WordPress...');
    await request(`${SITE}/wp-login.php`);
    const params = new URLSearchParams();
    params.append('log', USER);
    params.append('pwd', PASS);
    params.append('rememberme', 'forever');
    params.append('wp-submit', 'Log In');
    params.append('redirect_to', `${SITE}/wp-admin/`);

    const loginRes = await request(`${SITE}/wp-login.php`, {
        method: 'POST',
        body: params,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    console.log('Login completed. Current cookies:', Object.keys(cookieJar));

    console.log('[2/4] Getting plugin-install nonce...');
    const installPageRes = await request(`${SITE}/wp-admin/plugin-install.php?tab=upload`);
    const installHtml = await installPageRes.text();
    const nonceMatch = installHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
    if (!nonceMatch) {
        throw new Error('Failed to find plugin upload nonce');
    }
    const nonce = nonceMatch[1];
    console.log('Nonce:', nonce);

    console.log('[3/4] Uploading nesports-updater-v52.zip...');
    const zipBytes = fs.readFileSync(ZIP_PATH);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const preParts = [
        `--${boundary}\r\nContent-Disposition: form-data; name="_wpnonce"\r\n\r\n${nonce}\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="_wp_http_referer"\r\n\r\n/wp-admin/plugin-install.php?tab=upload\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="pluginzip"; filename="nesports-updater-v52.zip"\r\nContent-Type: application/zip\r\n\r\n`
    ];
    const postParts = `\r\n--${boundary}\r\nContent-Disposition: form-data; name="install-plugin-submit"\r\n\r\nInstall Now\r\n--${boundary}--\r\n`;

    const bodyBuffer = Buffer.concat([
        Buffer.from(preParts.join('')),
        zipBytes,
        Buffer.from(postParts)
    ]);

    const uploadRes = await request(`${SITE}/wp-admin/update.php?action=upload-plugin`, {
        method: 'POST',
        body: bodyBuffer,
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': String(bodyBuffer.length)
        }
    });

    const uploadHtml = await uploadRes.text();
    console.log('Upload response status:', uploadRes.status, 'HTML length:', uploadHtml.length);

    const activateMatch = uploadHtml.match(/href="([^"]*plugins\.php\?action=activate[^"]*)"/);
    if (activateMatch) {
        let activateUrl = activateMatch[1].replace(/&amp;/g, '&');
        if (!activateUrl.startsWith('http')) {
            activateUrl = `${SITE}/wp-admin/${activateUrl.replace(/^\//, '')}`;
        }
        console.log('[4/4] Activating plugin at:', activateUrl);
        const actRes = await request(activateUrl);
        console.log('Activated! Status:', actRes.status);
    } else {
        const replaceMatch = uploadHtml.match(/href="([^"]*update\.php\?action=upload-plugin[^"]*overwrite[^"]*)"/);
        if (replaceMatch) {
            console.log('Replacing existing plugin...');
            let replaceUrl = replaceMatch[1].replace(/&amp;/g, '&');
            if (!replaceUrl.startsWith('http')) {
                replaceUrl = `${SITE}/wp-admin/${replaceUrl.replace(/^\//, '')}`;
            }
            const replaceRes = await request(replaceUrl);
            const replaceHtml = await replaceRes.text();
            const act2Match = replaceHtml.match(/href="([^"]*plugins\.php\?action=activate[^"]*)"/);
            if (act2Match) {
                let actUrl = act2Match[1].replace(/&amp;/g, '&');
                if (!actUrl.startsWith('http')) {
                    actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
                }
                await request(actUrl);
                console.log('Replaced and Activated!');
            }
        } else {
            console.log('No direct activate link found. Response snippet:', uploadHtml.substring(0, 500));
        }
    }

    console.log('Deployment complete!');
}

deploy().catch(err => {
    console.error('Deployment failed:', err);
    process.exit(1);
});
