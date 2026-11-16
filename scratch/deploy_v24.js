const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

const BASE_DIR = path.resolve(__dirname, '..');
const STORE_DIR = path.join(BASE_DIR, 'nesports-pro-store');

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
async function request(url, options = {}, retries = 3) {
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
            await new Promise(r => setTimeout(r, 1000));
            return request(url, options, retries - 1);
        }
        throw err;
    }
}

(async () => {
    // 1. Login
    console.log("Logging into WordPress...");
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
    console.log("Logged in successfully!");

    // 2. Fetch plugins.php and deactivate old updater plugins
    let pRes = await request(SITE + '/wp-admin/plugins.php');
    let pHtml = await pRes.text();

    const deactMatches = pHtml.match(/href="([^"]*action=deactivate[^"]*plugin=(?:nesports-patch|nesports-sync|nesports-updater)[^"]*)"/g);
    if (deactMatches) {
        for (const raw of deactMatches) {
            const urlMatch = raw.match(/href="([^"]+)"/);
            if (urlMatch) {
                let deactUrl = urlMatch[1].replace(/&amp;/g, '&');
                if (!deactUrl.startsWith('http')) deactUrl = new URL(deactUrl, SITE + '/wp-admin/').href;
                console.log("Deactivating old plugin:", deactUrl);
                await request(deactUrl);
            }
        }
    }

    // 3. Prepare brand new plugin: nesports-updater-v24
    const PLUGIN_NAME = 'nesports-updater-v24';
    console.log(`Building ${PLUGIN_NAME}...`);

    const hoverFiles = [
        'model-strength-club-hover.jpg',
        'model-lift-the-world-hover.jpg',
        'model-anime-hover.jpg',
        'model-son-of-the-west-hover.jpg',
        'model-pro-coach-hover.jpg',
        'model-hoodie-hover.jpg',
        'model-trousers-hover.jpg'
    ];

    const filesToDeploy = {
        'templates/sections/section-clothing.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'sections', 'section-clothing.php'), 'utf8'),
        'includes/helpers.php': fs.readFileSync(path.join(STORE_DIR, 'includes', 'helpers.php'), 'utf8')
    };

    for (const img of hoverFiles) {
        filesToDeploy[`assets/images/clothing/${img}`] = fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', img));
    }

    let payloadsPhp = '';
    for (const [relPath, content] of Object.entries(filesToDeploy)) {
        const isBin = Buffer.isBuffer(content);
        const b64 = (isBin ? content : Buffer.from(content, 'utf8')).toString('base64');
        console.log(`Added payload: ${relPath} (${isBin ? content.length : Buffer.byteLength(content)} bytes)`);
        payloadsPhp += `        '${relPath}' => base64_decode('${b64}'),\n`;
    }

    const updaterPhp = `<?php
/**
 * Plugin Name: NESports Updater V24 (Realistic Gym Model Hover Images)
 * Description: Replaces flatlay hover cutouts with realistic gym model front/action poses.
 * Version: 24.0
 * Author: NESports
 */

if (!defined('ABSPATH')) exit;

function run_nesports_v24_update() {
    $target_dirs = array(
        WP_PLUGIN_DIR . '/nesports-pro',
        WP_PLUGIN_DIR . '/nesports-pro-store',
        WP_PLUGIN_DIR . '/nesports-custom'
    );
    if (is_dir(WP_PLUGIN_DIR)) {
        $files = scandir(WP_PLUGIN_DIR);
        foreach ($files as $f) {
            if ($f === '.' || $f === '..') continue;
            if (strpos($f, 'nesports-pro') === 0) {
                $full = WP_PLUGIN_DIR . '/' . $f;
                if (is_dir($full) && !in_array($full, $target_dirs)) {
                    $target_dirs[] = $full;
                }
            }
        }
    }
    
    $payloads = array(
${payloadsPhp}
    );
    
    $results = array();
    foreach ($target_dirs as $td) {
        if (!is_dir($td)) continue;
        $results[$td] = array();
        foreach ($payloads as $rel => $data) {
            $dest = $td . '/' . $rel;
            $d = dirname($dest);
            if (!is_dir($d)) {
                if (function_exists('wp_mkdir_p')) {
                    wp_mkdir_p($d);
                } else {
                    @mkdir($d, 0755, true);
                }
            }
            $w = file_put_contents($dest, $data);
            $results[$td][$rel] = ($w !== false) ? "SUCCESS ($w bytes)" : "ERROR";
        }
    }
    return $results;
}

add_action('init', function() {
    if (isset($_GET['nesports_apply_v24']) && $_GET['nesports_apply_v24'] === '1') {
        $res = run_nesports_v24_update();
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'ok', 'results' => $res));
        exit;
    }
});

register_activation_hook(__FILE__, function() {
    run_nesports_v24_update();
});
`;

    const UPDATER_DIR = path.join(BASE_DIR, 'scratch', PLUGIN_NAME);
    const UPDATER_ZIP = path.join(BASE_DIR, 'scratch', `${PLUGIN_NAME}.zip`);

    if (fs.existsSync(UPDATER_DIR)) fs.rmSync(UPDATER_DIR, { recursive: true, force: true });
    if (fs.existsSync(UPDATER_ZIP)) fs.rmSync(UPDATER_ZIP, { force: true });
    fs.mkdirSync(UPDATER_DIR, { recursive: true });

    fs.writeFileSync(path.join(UPDATER_DIR, `${PLUGIN_NAME}.php`), updaterPhp, 'utf8');

    // Use make_zip.ps1 so there is NO extra nested directory level!
    execSync(`powershell -ExecutionPolicy Bypass -File scratch\\make_zip.ps1 -sourceDir "${UPDATER_DIR}" -zipPath "${UPDATER_ZIP}"`, { cwd: BASE_DIR });
    console.log("Created " + UPDATER_ZIP + " (" + (fs.statSync(UPDATER_ZIP).size / 1024 / 1024).toFixed(2) + " MB)");

    // 4. Upload zip
    console.log("Fetching upload nonce...");
    const installRes = await request(SITE + '/wp-admin/plugin-install.php?tab=upload');
    const installHtml = await installRes.text();
    const nonceMatch = installHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
    if (!nonceMatch) {
        console.error("No upload nonce found!");
        process.exit(1);
    }
    const nonce = nonceMatch[1];

    const zipBuffer = fs.readFileSync(UPDATER_ZIP);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    let body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="_wpnonce"\r\n\r\n${nonce}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="_wp_http_referer"\r\n\r\n/wp-admin/plugin-install.php?tab=upload\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="pluginzip"; filename="${PLUGIN_NAME}.zip"\r\nContent-Type: application/zip\r\n\r\n`),
        zipBuffer,
        Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="install-plugin-submit"\r\n\r\nInstall Now\r\n`),
        Buffer.from(`--${boundary}--\r\n`)
    ]);

    console.log("Uploading and installing plugin...");
    const upRes = await request(SITE + '/wp-admin/update.php?action=upload-plugin', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data; boundary=' + boundary },
        body: body
    });
    const upHtml = await upRes.text();

    const actMatch = upHtml.match(/href="([^"]*action=activate[^"]*plugin=[^"]*)"/);
    if (actMatch) {
        let actUrl = actMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
        console.log("Activating plugin via link:", actUrl);
        await request(actUrl);
        console.log("Plugin activated!");
    } else {
        console.log("Checking plugins.php for activation link...");
        pRes = await request(SITE + '/wp-admin/plugins.php');
        pHtml = await pRes.text();
        const m = pHtml.match(new RegExp(`href="([^"]*action=activate[^"]*plugin=${PLUGIN_NAME}[^"]*)"`));
        if (m) {
            let actUrl = m[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
            await request(actUrl);
            console.log("Activated via plugins.php!");
        }
    }

    // 5. Trigger explicit update sync
    console.log("Triggering explicit update sync via ?nesports_apply_v24=1 ...");
    const syncRes = await request(SITE + '/?nesports_apply_v24=1');
    const syncText = await syncRes.text();
    console.log("Sync response sample:", syncText.substring(0, 300));

    // 6. Verify live image assets
    for (const a of hoverFiles) {
        const url = `${SITE}/wp-content/plugins/nesports-pro/assets/images/clothing/${a}`;
        const check = await request(url);
        console.log(`Live asset ${a} status: ${check.status} Length: ${check.headers.get('content-length')}`);
    }

    console.log("SUCCESSFULLY DEPLOYED REALISTIC GYM MODEL HOVER IMAGES (V24)!");
})().catch(err => {
    console.error("Deploy error:", err);
    process.exit(1);
});
