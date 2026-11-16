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

    // 3. Prepare brand new plugin: nesports-updater-v32
    const PLUGIN_NAME = 'nesports-updater-v32';
    console.log(`Building ${PLUGIN_NAME}...`);

    const filesToDeploy = {
        'assets/images/logo-1.png': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'logo-1.png')),
        'assets/images/header-logo.png': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'header-logo.png')),
        'assets/images/logo-1.svg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'logo-1.svg'), 'utf8'),
        'assets/images/header-logo.svg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'header-logo.svg'), 'utf8'),
        'templates/header-nesports.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'header-nesports.php'), 'utf8'),
        'assets/css/nesports-frontend.css': fs.readFileSync(path.join(STORE_DIR, 'assets', 'css', 'nesports-frontend.css'), 'utf8'),
        'assets/js/nesports-frontend.js': fs.readFileSync(path.join(STORE_DIR, 'assets', 'js', 'nesports-frontend.js'), 'utf8')
    };

    let payloadsPhp = '';
    for (const [relPath, content] of Object.entries(filesToDeploy)) {
        const isBin = Buffer.isBuffer(content);
        const b64 = (isBin ? content : Buffer.from(content, 'utf8')).toString('base64');
        console.log(`Added payload: ${relPath} (${isBin ? content.length : Buffer.byteLength(content)} bytes)`);
        payloadsPhp += `        '${relPath}' => base64_decode('${b64}'),\n`;
    }

    const updaterPhp = `<?php
/**
 * Plugin Name: NESPORTS3 Updater V32 (Transparent Fixed Header & Pure High-Res Vector Logo)
 * Description: Deploys transparent fixed header (sticky on scroll) and razor sharp vector logo.
 * Version: 32.0
 * Author: NESports
 */

if (!defined('ABSPATH')) exit;

function run_nesports_v32_update() {
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
    if (isset($_GET['nesports_apply_v32']) && $_GET['nesports_apply_v32'] === '1') {
        $res = run_nesports_v32_update();
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'ok', 'results' => $res));
        exit;
    }
});

register_activation_hook(__FILE__, function() {
    run_nesports_v32_update();
});
`;

    const UPDATER_DIR = path.join(BASE_DIR, 'scratch', PLUGIN_NAME);
    const UPDATER_ZIP = path.join(BASE_DIR, 'scratch', `${PLUGIN_NAME}.zip`);

    if (fs.existsSync(UPDATER_DIR)) fs.rmSync(UPDATER_DIR, { recursive: true, force: true });
    if (fs.existsSync(UPDATER_ZIP)) fs.rmSync(UPDATER_ZIP, { force: true });
    fs.mkdirSync(UPDATER_DIR, { recursive: true });

    fs.writeFileSync(path.join(UPDATER_DIR, `${PLUGIN_NAME}.php`), updaterPhp, 'utf8');

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
    console.log("Upload nonce:", nonce);

    const zipBuffer = fs.readFileSync(UPDATER_ZIP);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const crlf = '\r\n';

    let pre = '';
    pre += `--${boundary}${crlf}`;
    pre += `Content-Disposition: form-data; name="_wpnonce"${crlf}${crlf}${nonce}${crlf}`;
    pre += `--${boundary}${crlf}`;
    pre += `Content-Disposition: form-data; name="_wp_http_referer"${crlf}${crlf}/wp-admin/plugin-install.php?tab=upload${crlf}`;
    pre += `--${boundary}${crlf}`;
    pre += `Content-Disposition: form-data; name="pluginzip"; filename="${PLUGIN_NAME}.zip"${crlf}`;
    pre += `Content-Type: application/zip${crlf}${crlf}`;

    let post = `${crlf}--${boundary}--${crlf}`;

    const body = Buffer.concat([
        Buffer.from(pre, 'utf8'),
        zipBuffer,
        Buffer.from(post, 'utf8')
    ]);

    console.log("Uploading " + PLUGIN_NAME + "...");
    const uploadRes = await request(SITE + '/wp-admin/update.php?action=upload-plugin', {
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`
        },
        body: body
    });

    const uploadHtml = await uploadRes.text();
    console.log("Upload finished. Checking for activation link...");

    const activateMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*)"/i);
    if (activateMatch) {
        let actUrl = activateMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
        console.log("Activating plugin:", actUrl);
        await request(actUrl);
        console.log("Plugin activated!");
    } else {
        console.log("No activate link. Calling direct trigger...");
    }

    console.log("Calling direct trigger hook ?nesports_apply_v32=1...");
    const trigRes = await request(SITE + '/?nesports_apply_v32=1');
    const trigText = await trigRes.text();
    console.log("Trigger response:", trigText.substring(0, 300));
    console.log("\n=== V32 DEPLOYMENT FINISHED SUCCESSFULLY! ===");
})();
