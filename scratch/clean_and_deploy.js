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
    options.redirect = 'manual';
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            let res = await fetch(url, options);
            updateCookies(res);
            if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
                let loc = res.headers.get('location');
                if (!loc.startsWith('http')) loc = new URL(loc, url).href;
                return request(loc, { method: 'GET' });
            }
            return res;
        } catch (err) {
            console.log(`Fetch attempt ${attempt} failed: ${err.message}. Retrying in 2s...`);
            if (attempt === retries) throw err;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
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

    // 3. Prepare brand new plugin: nesports-updater-v16
    const PLUGIN_NAME = 'nesports-updater-v16';
    console.log(`Building ${PLUGIN_NAME}...`);

    const filesToDeploy = {
        'includes/helpers.php': fs.readFileSync(path.join(STORE_DIR, 'includes', 'helpers.php'), 'utf8'),
        'templates/sections/section-categories.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'sections', 'section-categories.php'), 'utf8'),
        'templates/sections/section-bundles.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'sections', 'section-bundles.php'), 'utf8'),
        'templates/sections/section-clothing.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'sections', 'section-clothing.php'), 'utf8'),
        'templates/sections/section-color.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'sections', 'section-color.php'), 'utf8'),
        'assets/css/nesports-frontend.css': fs.readFileSync(path.join(STORE_DIR, 'assets', 'css', 'nesports-frontend.css'), 'utf8'),

        // Red category gear assets - 100% Genuine Crimson Red
        'assets/images/model-lifting-straps-red.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'model-lifting-straps-red.jpg')),
        'assets/images/straps-red-angle-800x800.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'straps-red-angle-800x800.jpg')),
        'assets/images/belt-crimson-red-800x800.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'belt-crimson-red-800x800.jpg')),
        'assets/images/belt-crimson-red-flat-800x800.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'belt-crimson-red-flat-800x800.jpg')),
        'assets/images/belt-crimson-red-model-800x800.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'belt-crimson-red-model-800x800.jpg')),
        'assets/images/clothing/norm-lift-the-world-red.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'norm-lift-the-world-red.jpg')),
        'assets/images/clothing/norm-lift-the-world-red-front.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'norm-lift-the-world-red-front.jpg')),
        'assets/images/clothing/model-lift-the-world-red-sq.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'model-lift-the-world-red-sq.jpg')),

        // Clothing carousel model shots (from behind, authentic gym setting)
        'assets/images/clothing/model-strength-club-back.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'model-strength-club-back.jpg')),
        'assets/images/clothing/model-lift-the-world-back.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'model-lift-the-world-back.jpg')),
        'assets/images/clothing/model-anime-back.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'model-anime-back.jpg')),
        'assets/images/clothing/model-son-of-the-west-back.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'model-son-of-the-west-back.jpg')),
        'assets/images/clothing/model-pro-coach-back.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'model-pro-coach-back.jpg')),
        'assets/images/clothing/hoodie-pro-coach-back.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'hoodie-pro-coach-back.jpg')),
        'assets/images/clothing/hoodie-pro-coach-front.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'hoodie-pro-coach-front.jpg')),
        'assets/images/clothing/trousers-lifter-sweatpants.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'trousers-lifter-sweatpants.jpg')),

        // Normalized flat lays & other models
        'assets/images/clothing/norm-pro-coach-green.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'norm-pro-coach-green.jpg')),
        'assets/images/clothing/norm-pro-coach-green-front.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'norm-pro-coach-green-front.jpg')),
        'assets/images/clothing/model-pro-coach-green-sq.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'model-pro-coach-green-sq.jpg')),
        'assets/images/clothing/norm-lift-the-world-black.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'norm-lift-the-world-black.jpg')),
        'assets/images/clothing/norm-strength-club-black.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'norm-strength-club-black.jpg')),
        'assets/images/clothing/norm-strength-club-black-front.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'norm-strength-club-black-front.jpg')),
        'assets/images/clothing/norm-strength-club-blue.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'norm-strength-club-blue.jpg')),
        'assets/images/clothing/norm-strength-club-blue-front.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'norm-strength-club-blue-front.jpg')),
        'assets/images/clothing/norm-pro-coach-navy.jpg': fs.readFileSync(path.join(STORE_DIR, 'assets', 'images', 'clothing', 'norm-pro-coach-navy.jpg')),
    };

    let payloadsPhp = '';
    for (const [rel, content] of Object.entries(filesToDeploy)) {
        const b64 = Buffer.isBuffer(content) ? content.toString('base64') : Buffer.from(content).toString('base64');
        payloadsPhp += `        '${rel}' => base64_decode('${b64}'),\n`;
        console.log("Added payload:", rel, "(" + content.length + " bytes)");
    }

    const updaterPhp = `<?php
/**
 * Plugin Name: NESports Auto Updater V16
 * Description: Eliminates card inside card, sets 100% genuine crimson red belt and gear, updates authentic model shots.
 * Version: 16.0.0
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

    console.log("\nShop by Color & Live Verification:");
    console.log("- Status:", homeCheck.status);
    console.log("- Has norm-lift-the-world-red.jpg:", homeHtml.includes('norm-lift-the-world-red.jpg'));
    console.log("- Has norm-lift-the-world-red-front.jpg:", homeHtml.includes('norm-lift-the-world-red-front.jpg'));
    console.log("- Has model-lift-the-world-red-sq.jpg:", homeHtml.includes('model-lift-the-world-red-sq.jpg'));
    console.log("- Has belt-crimson-red-800x800.jpg:", homeHtml.includes('belt-crimson-red-800x800.jpg'));
    console.log("- Has model-lifting-straps-red.jpg:", homeHtml.includes('model-lifting-straps-red.jpg'));
    console.log("- Has straps-red-angle-800x800.jpg:", homeHtml.includes('straps-red-angle-800x800.jpg'));
    console.log("- Has hero-knee-wrap.png:", homeHtml.includes('hero-knee-wrap.png'));
    console.log("- Has hero-speed-ball.png:", homeHtml.includes('hero-speed-ball.png'));
    console.log("- Has NO awkward collar crop in Red (Lift-The-World-T-Shirt-Red-Detail.jpg):", !homeHtml.includes('Lift-The-World-T-Shirt-Red-Detail.jpg'));
    console.log("- Has model-strength-club-back.jpg:", homeHtml.includes('model-strength-club-back.jpg'));
    console.log("- Has model-lift-the-world-back.jpg:", homeHtml.includes('model-lift-the-world-back.jpg'));
    console.log("- Has model-anime-back.jpg:", homeHtml.includes('model-anime-back.jpg'));
    console.log("- Has model-son-of-the-west-back.jpg:", homeHtml.includes('model-son-of-the-west-back.jpg'));
    console.log("- Has model-pro-coach-back.jpg:", homeHtml.includes('model-pro-coach-back.jpg'));
    console.log("- Has hoodie-pro-coach-back.jpg:", homeHtml.includes('hoodie-pro-coach-back.jpg'));
    console.log("- Has trousers-lifter-sweatpants.jpg:", homeHtml.includes('trousers-lifter-sweatpants.jpg'));
    console.log("- Has NO SAVE 15% or Save 15% in Top Sellers:", !homeHtml.includes('Save 15%'));
    console.log("- Has NO blue bag in Grey tab:", !homeHtml.match(/data-color="grey"[\s\S]*?Gym-Bag-8-800x800\.jpg/));
})();
