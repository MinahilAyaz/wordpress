const fs = require('fs');
const path = require('path');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';

const BASE_DIR = path.resolve(__dirname, '..');
const STORE_DIR = path.join(BASE_DIR, 'nesports-pro-store');

// Read all code files
const filesToDeploy = {
    'includes/helpers.php': fs.readFileSync(path.join(STORE_DIR, 'includes', 'helpers.php'), 'utf8'),
    'templates/page-category.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'page-category.php'), 'utf8'),
    'templates/footer-nesports.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'footer-nesports.php'), 'utf8'),
    'templates/sections/section-color.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'sections', 'section-color.php'), 'utf8'),
    'templates/sections/section-clothing.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'sections', 'section-clothing.php'), 'utf8'),
    'assets/css/nesports-frontend.css': fs.readFileSync(path.join(STORE_DIR, 'assets', 'css', 'nesports-frontend.css'), 'utf8'),
    'assets/images/footer-logo.svg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'footer-logo.svg'), 'utf8')
};

let payloadsPhp = '';
for (const [rel, content] of Object.entries(filesToDeploy)) {
    const b64 = Buffer.from(content).toString('base64');
    payloadsPhp += `        '${rel}' => base64_decode('${b64}'),\n`;
    console.log('Packaged:', rel, '(' + content.length + ' bytes)');
}

const patchPhpContent = `<?php
/**
 * Plugin Name: NESports Hotfix Patch
 * Description: Code & Templates Sync
 * Version: 2.1.0
 * Author: NESports
 */

function run_nesports_hotfix() {
    $target_dirs = array(
        WP_PLUGIN_DIR . '/nesports-pro',
        WP_PLUGIN_DIR . '/nesports-pro-store'
    );
    
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
                wp_mkdir_p($d);
            }
            $w = file_put_contents($dest, $data);
            $results[$td][$rel] = ($w !== false) ? "SUCCESS ($w bytes)" : "ERROR";
        }
    }
    return $results;
}

add_action('init', function() {
    if (isset($_GET['run_nesports_patch']) && $_GET['run_nesports_patch'] === '1') {
        $res = run_nesports_hotfix();
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'ok', 'results' => $res));
        exit;
    }
});

register_activation_hook(__FILE__, function() {
    run_nesports_hotfix();
});
`;

const PATCH_DIR = path.join(BASE_DIR, 'scratch', 'nesports-patch');
const PATCH_ZIP = path.join(BASE_DIR, 'scratch', 'nesports-patch.zip');

if (fs.existsSync(PATCH_DIR)) fs.rmSync(PATCH_DIR, { recursive: true, force: true });
fs.mkdirSync(PATCH_DIR, { recursive: true });

fs.writeFileSync(path.join(PATCH_DIR, 'nesports-patch.php'), patchPhpContent, 'utf8');

const { execSync } = require('child_process');
execSync('powershell -Command "Start-Sleep -Milliseconds 500"');
if (fs.existsSync(PATCH_ZIP)) fs.unlinkSync(PATCH_ZIP);
execSync(`powershell -Command "Compress-Archive -Path '${PATCH_DIR}/*' -DestinationPath '${PATCH_ZIP}' -Force"`, { cwd: BASE_DIR });
console.log('Created ' + PATCH_ZIP + ' (' + (fs.statSync(PATCH_ZIP).size / 1024).toFixed(2) + ' KB)');

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
    console.log("Logging into WordPress admin...");
    await request(SITE + '/wp-login.php');
    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('rememberme', 'forever');
    formParams.append('wp-submit', 'Log In');
    formParams.append('redirect_to', SITE + '/wp-admin/');
    await request(SITE + '/wp-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
    });
    console.log("Logged in!");

    const installRes = await request(SITE + '/wp-admin/plugin-install.php?tab=upload');
    const installHtml = await installRes.text();
    const nonceMatch = installHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
    if (!nonceMatch) {
        console.error("No upload nonce found!");
        process.exit(1);
    }
    const nonce = nonceMatch[1];

    const zipBuffer = fs.readFileSync(PATCH_ZIP);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    let body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="_wpnonce"\r\n\r\n${nonce}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="_wp_http_referer"\r\n\r\n/wp-admin/plugin-install.php?tab=upload\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="pluginzip"; filename="nesports-patch.zip"\r\nContent-Type: application/zip\r\n\r\n`),
        zipBuffer,
        Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="install-plugin-submit"\r\n\r\nInstall Now\r\n`),
        Buffer.from(`--${boundary}--\r\n`)
    ]);

    console.log("Uploading patch zip...");
    const uploadRes = await request(SITE + '/wp-admin/update.php?action=upload-plugin', {
        method: 'POST',
        headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
        body: body
    });
    const uploadHtml = await uploadRes.text();
    console.log("Upload finished. Status:", uploadRes.status);

    if (uploadHtml.includes('Replace current with uploaded') || uploadHtml.includes('update.php?action=update-selected-plugin')) {
        const replaceMatch = uploadHtml.match(/href="([^"]*action=update-selected-plugin[^"]*)"/);
        if (replaceMatch) {
            let replaceUrl = replaceMatch[1].replace(/&amp;/g, '&');
            if (!replaceUrl.startsWith('http')) replaceUrl = new URL(replaceUrl, SITE).href;
            console.log("Replacing current plugin with uploaded...");
            const repRes = await request(replaceUrl);
            await repRes.text();
            console.log("Replaced!");
        }
    }

    if (uploadHtml.includes('action=activate') || uploadHtml.includes('activate-plugin')) {
        const activateMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*plugin=nesports-patch[^"]*)"/);
        if (activateMatch) {
            let actUrl = activateMatch[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE).href;
            console.log("Activating plugin...");
            await request(actUrl);
        }
    }

    // Trigger run_nesports_patch=1
    console.log("Triggering hotfix execution...");
    const triggerRes = await request(SITE + '/?run_nesports_patch=1');
    const result = await triggerRes.text();
    console.log("Hotfix result:", result.slice(0, 400));
})();
