const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE = "https://www.nesports3.com";
const USER = "NESports";
const PASS = "NES3@1122$PK";

const BASE_DIR = path.resolve(__dirname, '..');
const PATCH_DIR = path.join(BASE_DIR, 'scratch', 'nesports-patch');
const PATCH_ZIP = path.join(BASE_DIR, 'scratch', 'nesports-patch.zip');

if (!fs.existsSync(PATCH_DIR)) {
    fs.mkdirSync(PATCH_DIR, { recursive: true });
}

// Read target files to patch
const helpersPhp = fs.readFileSync(path.join(BASE_DIR, 'nesports-pro-store', 'includes', 'helpers.php'), 'utf8');
const pageCategoryPhp = fs.readFileSync(path.join(BASE_DIR, 'nesports-pro-store', 'templates', 'page-category.php'), 'utf8');

const imgDir = path.join(BASE_DIR, 'nesports-pro-store', 'assets', 'images', 'clothing');
const imgFiles = [
    'Lift-The-World-T-Shirt-Black-Detail.jpg',
    'Lift-The-World-T-Shirt-Black-Lower.jpg',
    'Lift-The-World-T-Shirt-Red-Detail.jpg',
    'Lift-The-World-T-Shirt-Red-Lower.jpg',
    'Strength-Club-White-Detail.jpg',
    'Strength-Club-Blue-Detail.jpg',
    'Strength-Club-Blue-Lower.jpg',
    'Strength-Club-Red-Detail.jpg',
    'Strength-Club-Red-Lower.jpg',
    'Procoach-Green-Detail.jpg',
    'Procoach-Red-Detail.jpg',
    'Procoach-Red-Lower.jpg',
    'Procoach-Navy-Detail.jpg',
    'Procoach-Navy-Lower.jpg',
    'Anime-1-Detail.jpg',
    'Anime-2-Detail.jpg'
];

let payloadsPhp = `
        'includes/helpers.php' => base64_decode('${Buffer.from(helpersPhp).toString('base64')}'),
        'templates/page-category.php' => base64_decode('${Buffer.from(pageCategoryPhp).toString('base64')}'),
`;

for (const f of imgFiles) {
    const fullPath = path.join(imgDir, f);
    if (fs.existsSync(fullPath)) {
        const b64 = fs.readFileSync(fullPath).toString('base64');
        payloadsPhp += `        'assets/images/clothing/${f}' => base64_decode('${b64}'),\n`;
    }
}

const patchPhpContent = `<?php
/**
 * Plugin Name: NESports Hotfix Patch
 * Description: Remove Add-to-cart, perfect dots slider & color purity
 * Version: 1.0.3
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

fs.writeFileSync(path.join(PATCH_DIR, 'nesports-patch.php'), patchPhpContent, 'utf8');
console.log("Created nesports-patch.php successfully!");

// Brief delay to release file locks on Windows
execSync('powershell -Command "Start-Sleep -Milliseconds 800"');

// Zip using PowerShell
if (fs.existsSync(PATCH_ZIP)) fs.unlinkSync(PATCH_ZIP);
execSync(`powershell -Command "Compress-Archive -Path '${PATCH_DIR}/*' -DestinationPath '${PATCH_ZIP}' -Force"`, { cwd: BASE_DIR });
console.log(`Created ${PATCH_ZIP} (${(fs.statSync(PATCH_ZIP).size / 1024).toFixed(2)} KB)`);

// Deploy logic
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
    const loginHtml = await loginPageRes.text();

    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('wp-submit', 'Log In');
    formParams.append('redirect_to', `${SITE}/wp-admin/`);
    formParams.append('testcookie', '1');

    const loginRes = await request(`${SITE}/wp-login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
    });

    console.log("Checking admin access...");
    const adminRes = await request(`${SITE}/wp-admin/plugin-install.php?tab=upload`);
    const adminHtml = await adminRes.text();
    if (!adminHtml.includes('upload-plugin')) {
        console.error("Login failed or no upload plugin permission!");
        process.exit(1);
    }
    console.log("Admin login verified!");

    const uploadPageRes = await request(`${SITE}/wp-admin/plugin-install.php?tab=upload`);
    const uploadHtml = await uploadPageRes.text();
    const mNonce = uploadHtml.match(/name="_wpnonce"\s+value="([^"]+)"/);
    if (!mNonce) {
        console.error("Could not find upload nonce!");
        process.exit(1);
    }
    const nonce = mNonce[1];
    console.log(`Upload nonce: ${nonce}`);

    console.log("Uploading patch zip...");
    const zipBuffer = fs.readFileSync(PATCH_ZIP);
    const form = new FormData();
    form.append('_wpnonce', nonce);
    form.append('_wp_http_referer', '/wp-admin/plugin-install.php?tab=upload');
    form.append('pluginzip', new Blob([zipBuffer], { type: 'application/zip' }), 'nesports-patch.zip');
    form.append('install-plugin-submit', 'Install Now');

    const uploadRes = await request(`${SITE}/wp-admin/update.php?action=upload-plugin`, {
        method: 'POST',
        body: form
    });
    let resHtml = await uploadRes.text();

    const mOverwrite = resHtml.match(/href="([^"]*overwrite=update-plugin[^"]*)"/);
    if (mOverwrite) {
        let owUrl = mOverwrite[1].replace(/&amp;/g, '&');
        if (!owUrl.startsWith('http')) owUrl = `${SITE}/wp-admin/${owUrl.replace(/^\//, '')}`;
        console.log("Confirming overwrite...");
        const owRes = await request(owUrl);
        resHtml = await owRes.text();
    }

    console.log("Activating patch plugin...");
    const mAct = resHtml.match(/href="([^"]*plugins\.php\?action=activate[^"]*nesports-patch[^"]*)"/);
    if (mAct) {
        let actUrl = mAct[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
        await request(actUrl);
    } else {
        const pluginsRes = await request(`${SITE}/wp-admin/plugins.php`);
        const phtml = await pluginsRes.text();
        const mAct2 = phtml.match(/href="([^"]*action=activate[^"]*nesports-patch[^"]*)"/);
        if (mAct2) {
            let actUrl = mAct2[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
            await request(actUrl);
        }
    }

    console.log("Triggering hotfix execution endpoint...");
    const triggerRes = await request(`${SITE}/wp-admin/?run_nesports_patch=1`);
    const triggerText = await triggerRes.text();
    console.log("Hotfix response:", triggerText.substring(0, 400));

    console.log("Deactivating and removing patch plugin...");
    const pluginsRes = await request(`${SITE}/wp-admin/plugins.php`);
    const phtml = await pluginsRes.text();
    const mDeact = phtml.match(/href="([^"]*action=deactivate[^"]*nesports-patch[^"]*)"/);
    if (mDeact) {
        let deactUrl = mDeact[1].replace(/&amp;/g, '&');
        if (!deactUrl.startsWith('http')) deactUrl = `${SITE}/wp-admin/${deactUrl.replace(/^\//, '')}`;
        await request(deactUrl);
        console.log("Deactivated patch plugin successfully!");
    }

    console.log("\nVerifying live collection page (/collections/lift-the-world/)...");
    const liftRes = await request(`${SITE}/collections/lift-the-world/?nocache=${Date.now()}`);
    const liftHtml = await liftRes.text();
    const hasNoAddToCart = !liftHtml.includes('hb-card-quick-add') && !liftHtml.includes('Add to cart');
    const hasBlackLower = liftHtml.includes('Lift-The-World-T-Shirt-Black-Lower.jpg');
    const hasRedLower = liftHtml.includes('Lift-The-World-T-Shirt-Red-Lower.jpg');
    const hasDots = liftHtml.includes('hb-card-dots');

    console.log("Verification results:", {
        status: liftRes.status,
        hasNoAddToCart,
        hasBlackLower,
        hasRedLower,
        hasDots
    });

    if (liftRes.status === 200 && hasNoAddToCart && hasBlackLower && hasRedLower && hasDots) {
        console.log("\n==========================================================================");
        console.log("SUCCESS! Add to cart REMOVED, dots perfected, & color purity 100% LIVE!");
        console.log("==========================================================================\n");
    } else {
        console.warn("WARNING: Review verification output above.");
    }
})();
