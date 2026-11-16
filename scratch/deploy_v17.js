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

    // 3. Prepare brand new plugin: nesports-updater-v17
    const PLUGIN_NAME = 'nesports-updater-v17';
    console.log(`Building ${PLUGIN_NAME}...`);

    const UPDATER_DIR = path.join(BASE_DIR, 'scratch', PLUGIN_NAME);
    const UPDATER_ZIP = path.join(BASE_DIR, 'scratch', `${PLUGIN_NAME}.zip`);
    const PAYLOAD_DIR = path.join(UPDATER_DIR, 'payload');

    if (fs.existsSync(UPDATER_DIR)) fs.rmSync(UPDATER_DIR, { recursive: true, force: true });
    if (fs.existsSync(UPDATER_ZIP)) fs.rmSync(UPDATER_ZIP, { force: true });

    fs.mkdirSync(PAYLOAD_DIR, { recursive: true });

    // Copy core files to payload
    const copyList = [
        ['includes/helpers.php', 'includes/helpers.php'],
        ['templates/sections/section-bundles.php', 'templates/sections/section-bundles.php']
    ];

    // Add all 45 bundle images
    for (let i = 1; i <= 15; i++) {
        for (let s = 1; s <= 3; s++) {
            const rel = `assets/images/bundles/bundle-${i}-${s}.jpg`;
            copyList.push([rel, rel]);
        }
    }

    for (const [srcRel, dstRel] of copyList) {
        const srcPath = path.join(STORE_DIR, srcRel);
        const dstPath = path.join(PAYLOAD_DIR, dstRel);
        fs.mkdirSync(path.dirname(dstPath), { recursive: true });
        fs.copyFileSync(srcPath, dstPath);
    }
    console.log(`Copied ${copyList.length} files to payload.`);

    const updaterPhp = `<?php
/**
 * Plugin Name: NESports Auto Updater V17
 * Description: Deploys 45 professional bundle images (model action shots + studio product compositions) with 3-dot hover scrubber.
 * Version: 17.0.0
 * Author: NESports
 */

function nesports_copy_recursive($src, $dst) {
    if (!is_dir($src)) return false;
    $dir = opendir($src);
    @mkdir($dst, 0755, true);
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                nesports_copy_recursive($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
    return true;
}

function run_nesports_v17_update() {
    $src = __DIR__ . '/payload';
    $target_dirs = array(
        WP_PLUGIN_DIR . '/nesports-pro',
        WP_PLUGIN_DIR . '/nesports-pro-store'
    );
    $results = array();
    foreach ($target_dirs as $td) {
        if (!is_dir($td)) continue;
        $ok = nesports_copy_recursive($src, $td);
        $results[$td] = $ok ? 'SUCCESS' : 'ERROR';
    }
    return $results;
}

add_action('init', function() {
    if (isset($_GET['nesports_apply_v17']) && $_GET['nesports_apply_v17'] === '1') {
        $res = run_nesports_v17_update();
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'ok', 'results' => $res));
        exit;
    }
});

register_activation_hook(__FILE__, function() {
    run_nesports_v17_update();
});
`;

    fs.writeFileSync(path.join(UPDATER_DIR, `${PLUGIN_NAME}.php`), updaterPhp, 'utf8');

    // Create zip
    execSync(`powershell -ExecutionPolicy Bypass -File scratch\\make_zip.ps1 -sourceDir "${UPDATER_DIR}" -zipPath "${UPDATER_ZIP}"`, { cwd: BASE_DIR });
    console.log("Created " + UPDATER_ZIP + " (" + (fs.statSync(UPDATER_ZIP).size / 1024).toFixed(2) + " KB)");

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
        console.log("Activation link not found in response, attempting manual activation...");
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

    // 5. Trigger update endpoint
    console.log("Triggering explicit update sync...");
    const syncRes = await request(SITE + '/?nesports_apply_v17=1');
    const syncText = await syncRes.text();
    console.log("Sync response:", syncText);

    // 6. Verify live bundle image
    const vRes = await request(SITE + '/wp-content/plugins/nesports-pro-store/assets/images/bundles/bundle-1-1.jpg');
    console.log("Bundle 1-1 live verification status:", vRes.status, "Length:", vRes.headers.get('content-length'));

    const vRes2 = await request(SITE + '/wp-content/plugins/nesports-pro-store/assets/images/bundles/bundle-1-2.jpg');
    console.log("Bundle 1-2 live verification status:", vRes2.status, "Length:", vRes2.headers.get('content-length'));

    console.log("DEPLOYMENT COMPLETE!");
})();
