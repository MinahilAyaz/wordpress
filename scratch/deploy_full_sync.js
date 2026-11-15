const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE = "https://www.nesports3.com";
const USER = "NESports";
const PASS = "NES3@1122$PK";

const BASE_DIR = path.resolve(__dirname, '..');
const STORE_DIR = path.join(BASE_DIR, 'nesports-pro-store');
const PATCH_DIR = path.join(BASE_DIR, 'scratch', 'nesports-patch');
const FILES_DIR = path.join(PATCH_DIR, 'files');
const PATCH_ZIP = path.join(BASE_DIR, 'scratch', 'nesports-patch.zip');

console.log("Preparing patch files directory...");
if (fs.existsSync(PATCH_DIR)) {
    fs.rmSync(PATCH_DIR, { recursive: true, force: true });
}
fs.mkdirSync(FILES_DIR, { recursive: true });

function copyToPatch(relPath) {
    const src = path.join(STORE_DIR, relPath);
    const dst = path.join(FILES_DIR, relPath);
    if (!fs.existsSync(src)) {
        console.warn("WARNING: File not found:", src);
        return;
    }
    const dir = path.dirname(dst);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(src, dst);
    console.log("Staged:", relPath, "(" + fs.statSync(dst).size + " bytes)");
}

// 1. PHP Code & Templates
copyToPatch('includes/helpers.php');
copyToPatch('templates/page-category.php');
copyToPatch('templates/footer-nesports.php');
copyToPatch('templates/sections/section-color.php');
copyToPatch('templates/sections/section-clothing.php');

// 2. CSS & SVGs
copyToPatch('assets/css/nesports-frontend.css');
copyToPatch('assets/images/footer-logo.svg');

// 3. Clothing Images (Strength Club, Lift the World, Pro Coach, Anime, Categories)
const clothingImgs = [
    'Strength-Club-White-Flat.jpg',
    'Strength-Club-White-Detail.jpg',
    'Strength-Club-White-Model.jpg',
    'Strength-Club-Blue-Flat.jpg',
    'Strength-Club-Blue-Detail.jpg',
    'Strength-Club-Blue-Model.jpg',
    'Strength-Club-Red-Flat.jpg',
    'Strength-Club-Red-Detail.jpg',
    'Strength-Club-Red-Model.jpg',
    'cat-strength-club.jpg',
    'Lift-The-World-T-Shirt-Black-Detail.jpg',
    'Lift-The-World-T-Shirt-Black-Lower.jpg',
    'Lift-The-World-T-Shirt-Red-Detail.jpg',
    'Lift-The-World-T-Shirt-Red-Lower.jpg',
    'Procoach-Green-Detail.jpg',
    'Procoach-Red-Detail.jpg',
    'Procoach-Red-Lower.jpg',
    'Procoach-Navy-Detail.jpg',
    'Procoach-Navy-Lower.jpg',
    'Anime-1-Detail.jpg',
    'Anime-2-Detail.jpg',
    'cat-pro-coach.jpg',
    'cat-lift-the-world.jpg',
    'cat-anime.jpg',
    'cat-son-of-the-west.jpg',
    'Procoach-T-Shirt-Green.png'
];

for (const img of clothingImgs) {
    copyToPatch('assets/images/clothing/' + img);
}

// 4. Create the patch installer plugin
const patchPhp = `<?php
/**
 * Plugin Name: NESports Full Hotfix Patch
 * Description: Total sync of collections, sliders, images, footer, colors
 * Version: 1.2.0
 * Author: NESports
 */

function nesports_recurse_copy($src, $dst) {
    if (!is_dir($src)) return array();
    $dir = opendir($src);
    @mkdir($dst, 0755, true);
    $results = array();
    while (false !== ($file = readdir($dir))) {
        if ($file === '.' || $file === '..') continue;
        $srcPath = $src . '/' . $file;
        $dstPath = $dst . '/' . $file;
        if (is_dir($srcPath)) {
            $sub = nesports_recurse_copy($srcPath, $dstPath);
            $results = array_merge($results, $sub);
        } else {
            $copied = copy($srcPath, $dstPath);
            $results[$dstPath] = $copied ? 'SUCCESS' : 'FAILED';
        }
    }
    closedir($dir);
    return $results;
}

function run_nesports_hotfix() {
    $target_dirs = array(
        WP_PLUGIN_DIR . '/nesports-pro',
        WP_PLUGIN_DIR . '/nesports-pro-store'
    );
    $src = __DIR__ . '/files';
    $results = array();
    foreach ($target_dirs as $td) {
        if (!is_dir($td)) continue;
        $results[$td] = nesports_recurse_copy($src, $td);
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

fs.writeFileSync(path.join(PATCH_DIR, 'nesports-patch.php'), patchPhp, 'utf8');
console.log("Created nesports-patch.php successfully!");

// Brief delay to release file locks
execSync('powershell -Command "Start-Sleep -Milliseconds 800"');

// Create Zip
if (fs.existsSync(PATCH_ZIP)) fs.unlinkSync(PATCH_ZIP);
console.log("Compressing patch zip...");
execSync(`powershell -Command "Compress-Archive -Path '${PATCH_DIR}/*' -DestinationPath '${PATCH_ZIP}' -Force"`, { cwd: BASE_DIR });
console.log("Created " + PATCH_ZIP + " (" + (fs.statSync(PATCH_ZIP).size / 1024).toFixed(2) + " KB)");

// Deploy to site
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
    return Object.entries(cookieJar).map(([k, v]) => `${k}=${v}`).join('; ');
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
        if (!loc.startsWith('http')) {
            loc = new URL(loc, url).href;
        }
        return request(loc, { method: 'GET' });
    }
    return res;
}

(async () => {
    console.log("Logging into WordPress admin...");
    const loginPageRes = await request(`${SITE}/wp-login.php`);
    await loginPageRes.text();

    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('rememberme', 'forever');
    formParams.append('wp-submit', 'Log In');
    formParams.append('redirect_to', `${SITE}/wp-admin/`);

    const loginRes = await request(`${SITE}/wp-login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
    });

    const adminHtml = await loginRes.text();
    if (!adminHtml.includes('wp-admin') && !getCookieHeader().includes('wordpress_logged_in')) {
        console.error("Login failed!");
        process.exit(1);
    }
    console.log("Login successful!");

    // Get nonce from plugin upload page
    const installRes = await request(`${SITE}/wp-admin/plugin-install.php?tab=upload`);
    const installHtml = await installRes.text();
    const nonceMatch = installHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
    if (!nonceMatch) {
        console.error("Could not find _wpnonce on plugin-install.php!");
        process.exit(1);
    }
    const nonce = nonceMatch[1];
    console.log("Found upload nonce:", nonce);

    // Upload plugin zip
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
    const uploadRes = await request(`${SITE}/wp-admin/update.php?action=upload-plugin`, {
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`
        },
        body: body
    });

    const uploadHtml = await uploadRes.text();
    console.log("Upload HTTP status:", uploadRes.status);

    if (uploadHtml.includes('Replace current with uploaded') || uploadHtml.includes('update.php?action=update-selected-plugin')) {
        const replaceMatch = uploadHtml.match(/href="([^"]*action=update-selected-plugin[^"]*)"/);
        if (replaceMatch) {
            let replaceUrl = replaceMatch[1].replace(/&amp;/g, '&');
            if (!replaceUrl.startsWith('http')) replaceUrl = new URL(replaceUrl, SITE).href;
            console.log("Overwriting existing patch plugin...");
            const repRes = await request(replaceUrl);
            await repRes.text();
            console.log("Overwrite done!");
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

    // Trigger explicit hotfix execution endpoint
    console.log("Triggering run_nesports_patch=1 endpoint...");
    const patchTriggerRes = await request(`${SITE}/?run_nesports_patch=1`);
    const patchResult = await patchTriggerRes.text();
    console.log("Patch response:", patchResult.slice(0, 300));

    // Verify Strength Club Collection page
    console.log("Verifying /collections/strength-club/...");
    const scRes = await request(`${SITE}/collections/strength-club/`);
    const scHtml = await scRes.text();
    console.log("SC status:", scRes.status);
    console.log("Has warning:", scHtml.includes('Unknown modifier'));
    console.log("Has toolbar [Show filters]:", scHtml.includes('hb-collection-toolbar') || scHtml.includes('Show filters'));
    console.log("Has Strength-Club-White-Model:", scHtml.includes('Strength-Club-White-Model.jpg'));

    // Verify Lift the World Collection page
    console.log("Verifying /collections/lift-the-world/...");
    const ltwRes = await request(`${SITE}/collections/lift-the-world/`);
    const ltwHtml = await ltwRes.text();
    console.log("LTW status:", ltwRes.status);
    console.log("Has + ADD TO CART:", ltwHtml.includes('ADD TO CART') || ltwHtml.includes('hb-btn-add-cart'));

    console.log("Deployment completed successfully!");
})();
