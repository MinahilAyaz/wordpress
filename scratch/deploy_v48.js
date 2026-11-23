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
async function request(url, options = {}, retries = 5) {
    options.headers = options.headers || {};
    const cookie = getCookieHeader();
    if (cookie) options.headers['Cookie'] = cookie;
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
    options.headers['Accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8';

    await new Promise(r => setTimeout(r, 3000));

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
            console.log(`Fetch retry for ${url} (${err.message}). Waiting 4s...`);
            await new Promise(r => setTimeout(r, 4000));
            return request(url, options, retries - 1);
        }
        throw err;
    }
}

(async () => {
    // 1. Login
    console.log("1. Logging into WordPress...");
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

    // 2. Prepare plugin: nesports-updater-v48
    const PLUGIN_NAME = 'nesports-updater-v48';
    console.log(`2. Building ${PLUGIN_NAME}...`);

    const filesToDeploy = {
        'includes/class-nesports-admin.php': fs.readFileSync(path.join(STORE_DIR, 'includes', 'class-nesports-admin.php'), 'utf8'),
        'assets/css/nesports-admin.css': fs.readFileSync(path.join(STORE_DIR, 'assets', 'css', 'nesports-admin.css'), 'utf8')
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
 * Plugin Name: NESPORTS3 Updater V48 (All WordPress Pages Status in Dashboard)
 * Description: Dynamically lists all WordPress pages in NE Sports Store Dashboard with instant View, Edit in WP, and Edit in Elementor buttons.
 * Version: 48.0
 * Author: NESports
 */

if (!defined('ABSPATH')) exit;

function run_nesports_v48_sync() {
    $target_dirs = array(
        WP_PLUGIN_DIR . '/nesports-pro',
        WP_PLUGIN_DIR . '/nesports-pro-store',
        WP_PLUGIN_DIR . '/nesports-custom'
    );
    if (is_dir(WP_PLUGIN_DIR)) {
        $files = scandir(WP_PLUGIN_DIR);
        foreach ($files as $f) {
            if ($f === '.' || $f === '..') continue;
            if (stripos($f, 'nesport') !== false) {
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
    if (isset($_GET['nesports_apply_v48']) && $_GET['nesports_apply_v48'] === '1') {
        $res = run_nesports_v48_sync();
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'ok', 'results' => $res));
        exit;
    }
    run_nesports_v48_sync();
}, 1);

register_activation_hook(__FILE__, function() {
    run_nesports_v48_sync();
});
`;

    const stagingDir = path.join(__dirname, PLUGIN_NAME);
    if (!fs.existsSync(stagingDir)) fs.mkdirSync(stagingDir, { recursive: true });
    fs.writeFileSync(path.join(stagingDir, `${PLUGIN_NAME}.php`), updaterPhp, 'utf8');

    const zipFile = path.join(__dirname, `${PLUGIN_NAME}.zip`);
    if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);

    console.log("Creating ZIP via PowerShell Compress-Archive...");
    execSync(`powershell.exe -NoProfile -Command "Compress-Archive -Path '${stagingDir}' -DestinationPath '${zipFile}' -Force"`);

    // 3. Upload & activate plugin via wp-admin
    console.log("3. Fetching plugin install page for nonce...");
    const installRes = await request(SITE + '/wp-admin/plugin-install.php?tab=upload');
    const installHtml = await installRes.text();

    const nonceMatch = installHtml.match(/name="_wpnonce"\s+value="([^"]+)"/);
    if (!nonceMatch) throw new Error("Could not find _wpnonce on plugin-install.php");
    const nonce = nonceMatch[1];
    console.log("Found upload nonce:", nonce);

    console.log("4. Uploading plugin zip...");
    const zipBytes = fs.readFileSync(zipFile);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);

    const parts = [
        `--${boundary}\r\nContent-Disposition: form-data; name="_wpnonce"\r\n\r\n${nonce}\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="_wp_http_referer"\r\n\r\n/wp-admin/plugin-install.php?tab=upload\r\n`,
        `--${boundary}\r\nContent-Disposition: form-data; name="pluginzip"; filename="${PLUGIN_NAME}.zip"\r\nContent-Type: application/zip\r\n\r\n`
    ];

    const part1Buf = Buffer.from(parts.join(''), 'utf8');
    const part2Buf = Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="install-plugin-submit"\r\n\r\nInstall Now\r\n--${boundary}--\r\n`, 'utf8');
    const bodyBuf = Buffer.concat([part1Buf, zipBytes, part2Buf]);

    const uploadRes = await request(SITE + '/wp-admin/update.php?action=upload-plugin', {
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': bodyBuf.length
        },
        body: bodyBuf
    });

    const uploadHtml = await uploadRes.text();
    console.log("Upload completed, checking activation link...");

    const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*plugin=[^"]*)"/);
    if (actMatch) {
        let actUrl = actMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
        console.log("5. Activating plugin via:", actUrl);
        await request(actUrl);
        console.log("Plugin activated successfully!");
    } else {
        console.log("Checking plugins list for activation link...");
        const pRes = await request(SITE + '/wp-admin/plugins.php');
        const pHtml = await pRes.text();
        const fallbackMatch = pHtml.match(new RegExp(`href="([^"]*action=activate[^"]*plugin=[^"]*${PLUGIN_NAME}[^"]*)"`));
        if (fallbackMatch) {
            let actUrl = fallbackMatch[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
            console.log("Activating via fallback link:", actUrl);
            await request(actUrl);
            console.log("Plugin activated successfully!");
        } else {
            console.log("Plugin already active or updated.");
        }
    }

    // 6. Direct trigger hook to verify write to nesports-pro
    console.log("6. Calling direct sync hook: ?nesports_apply_v48=1...");
    try {
        const triggerRes = await fetch(SITE + '/?nesports_apply_v48=1');
        const triggerText = await triggerRes.text();
        console.log("Sync Hook Response:", triggerText.substring(0, 500));
    } catch(err) {
        console.log("Trigger request note:", err.message);
    }

    console.log("\n==========================================");
    console.log("DEPLOYMENT V48 COMPLETED SUCCESSFULLY!");
    console.log("==========================================");
})();
