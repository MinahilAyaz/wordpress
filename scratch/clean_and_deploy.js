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
    console.log("Logging in...");
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
    console.log("Logged in!");

    // 2. Fetch plugins.php and deactivate any active patch/updater plugins
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

    // 3. Prepare brand new plugin: nesports-updater-v8
    const PLUGIN_NAME = 'nesports-updater-v8';
    console.log(`Building ${PLUGIN_NAME}...`);
    const filesToDeploy = {
        'includes/helpers.php': fs.readFileSync(path.join(STORE_DIR, 'includes', 'helpers.php'), 'utf8'),
        'templates/sections/section-categories.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'sections', 'section-categories.php'), 'utf8'),
        'templates/page-category.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'page-category.php'), 'utf8'),
        'templates/footer-nesports.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'footer-nesports.php'), 'utf8'),
        'templates/sections/section-color.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'sections', 'section-color.php'), 'utf8'),
        'templates/sections/section-clothing.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'sections', 'section-clothing.php'), 'utf8'),
        'assets/css/nesports-frontend.css': fs.readFileSync(path.join(STORE_DIR, 'assets', 'css', 'nesports-frontend.css'), 'utf8'),
        'assets/images/footer-logo.svg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'footer-logo.svg'), 'utf8'),
        'assets/images/clothing/Strength-Club-White-Flat.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-White-Flat.jpg')),
        'assets/images/clothing/Strength-Club-White-Front.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-White-Front.jpg')),
        'assets/images/clothing/Strength-Club-White-Model.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-White-Model.jpg')),
        'assets/images/clothing/Strength-Club-Blue-Flat.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Blue-Flat.jpg')),
        'assets/images/clothing/Strength-Club-Blue-Front.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Blue-Front.jpg')),
        'assets/images/clothing/Strength-Club-Blue-Model.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Blue-Model.jpg')),
        'assets/images/clothing/Strength-Club-Red-Flat.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Red-Flat.jpg')),
        'assets/images/clothing/Strength-Club-Red-Front.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Red-Front.jpg')),
        'assets/images/clothing/Strength-Club-Red-Model.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Red-Model.jpg')),
        'assets/images/clothing/cat-strength-club.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'cat-strength-club.jpg'))
    };

    let payloadsPhp = '';
    for (const [rel, content] of Object.entries(filesToDeploy)) {
        const b64 = Buffer.isBuffer(content) ? content.toString('base64') : Buffer.from(content).toString('base64');
        payloadsPhp += `        '${rel}' => base64_decode('${b64}'),\n`;
        console.log("Added payload:", rel, "(" + content.length + " bytes)");
    }

    const updaterPhp = `<?php
/**
 * Plugin Name: NESports Auto Updater V6
 * Description: Fully applies Top Sellers 3-image hover slider with dots, removes filter options, and fixes category hero.
 * Version: 6.0.0
 * Author: NESports
 */

function run_nesports_master_update() {
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
    if (isset($_GET['nesports_apply_update']) && $_GET['nesports_apply_update'] === '1') {
        $res = run_nesports_master_update();
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'ok', 'results' => $res));
        exit;
    }
});

register_activation_hook(__FILE__, function() {
    run_nesports_master_update();
});
`;

    const UPDATER_DIR = path.join(BASE_DIR, 'scratch', PLUGIN_NAME);
    const UPDATER_ZIP = path.join(BASE_DIR, 'scratch', `${PLUGIN_NAME}.zip`);

    if (fs.existsSync(UPDATER_DIR)) fs.rmSync(UPDATER_DIR, { recursive: true, force: true });
    fs.mkdirSync(UPDATER_DIR, { recursive: true });
    const fd = fs.openSync(path.join(UPDATER_DIR, `${PLUGIN_NAME}.php`), 'w');
    fs.writeSync(fd, updaterPhp, 0, 'utf8');
    fs.closeSync(fd);

    execSync('powershell -ExecutionPolicy Bypass -File scratch\\make_zip.ps1', { cwd: BASE_DIR });
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

    console.log(`Uploading ${PLUGIN_NAME}.zip...`);
    const uploadRes = await request(SITE + '/wp-admin/update.php?action=upload-plugin', {
        method: 'POST',
        headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
        body: body
    });
    const uploadHtml = await uploadRes.text();
    console.log("Upload status:", uploadRes.status);

    if (uploadHtml.includes('action=activate') || uploadHtml.includes('activate-plugin')) {
        const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*plugin=nesports-updater[^"]*)"/);
        if (actMatch) {
            let actUrl = actMatch[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
            console.log("Activating directly from upload page:", actUrl);
            await request(actUrl);
        }
    }

    // Also check plugins.php to ensure it is activated
    pRes = await request(SITE + '/wp-admin/plugins.php');
    pHtml = await pRes.text();
    const actMatch2 = pHtml.match(/href="([^"]*action=activate[^"]*plugin=nesports-updater[^\"]*)"/);
    if (actMatch2) {
        let actUrl2 = actMatch2[1].replace(/&amp;/g, '&');
        if (!actUrl2.startsWith('http')) actUrl2 = new URL(actUrl2, SITE + '/wp-admin/').href;
        console.log("Activating from plugins.php:", actUrl2);
        await request(actUrl2);
    }

    // 5. Trigger update endpoint
    console.log("Triggering nesports_apply_update=1...");
    const updateRes = await request(SITE + '/?nesports_apply_update=1');
    const updateText = await updateRes.text();
    console.log("Update output:", updateText.slice(0, 500));

    // 6. Comprehensive verification
    console.log("\nVerifying live pages...");
    const homeCheck = await request(SITE + '/');
    const homeHtml = await homeCheck.text();
    console.log("\nHomepage Top Sellers Check:");
    console.log("- Status:", homeCheck.status);
    console.log("- Has hb-card-slider-track:", homeHtml.includes('hb-card-slider-track'));
    console.log("- Has hb-card-dots-wrap:", homeHtml.includes('hb-card-dots-wrap'));
    console.log("- Has multi-angle Belts image:", homeHtml.includes('DSC_0167-scaled-1.jpg'));
    console.log("- Has multi-angle Knee Wraps image:", homeHtml.includes('Knee-Wrap-9-800x800.jpg'));
    console.log("- Has multi-angle Gym Bags image:", homeHtml.includes('Gym-Bag-9-800x800.jpg'));
    console.log("- Has multi-angle Speed Ball image:", homeHtml.includes('1-1-800x800.jpg'));
    console.log("- Has multi-angle Wrist Straps image:", homeHtml.includes('Wrist-Bandage-1-800x800.jpg'));
    console.log("- Has multi-angle Lifting Straps image:", homeHtml.includes('2-red-800x800.jpg'));

    console.log("\nHomepage Shop by Color Check:");
    console.log("- Has Shop by Color section:", homeHtml.includes('id="shop-by-color"'));
    console.log("- Has color sub-images (Lift-The-World-T-Shirt-Red-Detail.jpg):", homeHtml.includes('Lift-The-World-T-Shirt-Red-Detail.jpg'));
    console.log("- Has color sub-images (Procoach-Red-Detail.jpg):", homeHtml.includes('Procoach-Red-Detail.jpg'));
    console.log("- Has color sub-images (Strength-Club-Red-Front.jpg):", homeHtml.includes('Strength-Club-Red-Front.jpg'));
})();
