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
const footerPhp = fs.readFileSync(path.join(BASE_DIR, 'nesports-pro-store', 'templates', 'footer-nesports.php'), 'utf8');
const footerSvg = fs.readFileSync(path.join(BASE_DIR, 'nesports-pro-store', 'assets', 'images', 'footer-logo.svg'), 'utf8');
const frontendCss = fs.readFileSync(path.join(BASE_DIR, 'nesports-pro-store', 'assets', 'css', 'nesports-frontend.css'), 'utf8');
const mainPhp = fs.readFileSync(path.join(BASE_DIR, 'nesports-pro-store', 'nesports-pro-store.php'), 'utf8');
const helpersPhp = fs.readFileSync(path.join(BASE_DIR, 'nesports-pro-store', 'includes', 'helpers.php'), 'utf8');
const procoachJpg = fs.readFileSync(path.join(BASE_DIR, 'nesports-pro-store', 'assets', 'images', 'clothing', 'Procoach-T-Shirt-Green.jpg'));

const patchPhpContent = `<?php
/**
 * Plugin Name: NESports Hotfix Patch
 * Description: Updates clothing categories and footer logo
 * Version: 1.0.0
 * Author: NESports
 */

function run_nesports_hotfix() {
    $target_dirs = array(
        WP_PLUGIN_DIR . '/nesports-pro',
        WP_PLUGIN_DIR . '/nesports-pro-store'
    );
    
    $payloads = array(
        'templates/footer-nesports.php' => base64_decode('${Buffer.from(footerPhp).toString('base64')}'),
        'assets/images/footer-logo.svg' => base64_decode('${Buffer.from(footerSvg).toString('base64')}'),
        'assets/css/nesports-frontend.css' => base64_decode('${Buffer.from(frontendCss).toString('base64')}'),
        'nesports-pro-store.php' => base64_decode('${Buffer.from(mainPhp).toString('base64')}'),
        'includes/helpers.php' => base64_decode('${Buffer.from(helpersPhp).toString('base64')}'),
        'assets/images/clothing/Procoach-T-Shirt-Green.jpg' => base64_decode('${procoachJpg.toString('base64')}')
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

// Zip using PowerShell
if (fs.existsSync(PATCH_ZIP)) fs.unlinkSync(PATCH_ZIP);
execSync(`powershell -Command "Compress-Archive -Path '${PATCH_DIR}/*' -DestinationPath '${PATCH_ZIP}' -Force"`, { cwd: BASE_DIR });
console.log(`Created ${PATCH_ZIP} (${(fs.statSync(PATCH_ZIP).size / 1024).toFixed(2)} KB)`);

// Deploy using deploy logic
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
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0.0.0 Safari/537.36';
    options.redirect = 'manual';

    let res = await fetch(url, options);
    updateCookies(res);
    if (res.status >= 300 && res.status < 400) {
        const loc = res.headers.get('location');
        if (loc) {
            const nextUrl = loc.startsWith('http') ? loc : new URL(loc, url).toString();
            return request(nextUrl, { method: 'GET' });
        }
    }
    return res;
}

(async () => {
    console.log(`Logging in to WordPress at ${SITE}...`);
    await request(`${SITE}/wp-login.php`);
    await request(`${SITE}/wp-login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            log: USER,
            pwd: PASS,
            'wp-submit': 'Log In',
            redirect_to: `${SITE}/wp-admin/`,
            testcookie: '1'
        }).toString()
    });

    const isAuthed = Object.keys(cookieJar).some(k => k.includes('wordpress_logged_in_'));
    if (!isAuthed) {
        console.error("Login failed!");
        process.exit(1);
    }
    console.log("Logged in successfully!");

    console.log("Fetching upload nonce...");
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
    console.log("Hotfix response:", triggerText.substring(0, 300));

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

    console.log("Verifying live site homepage...");
    const homeRes = await request(`${SITE}/?nocache=${Date.now()}`);
    const homeHtml = await homeRes.text();
    const hasSvg = homeHtml.includes('footer-logo.svg');
    const hasHeight64 = homeHtml.includes('height: 64px') || homeHtml.includes('height:64px');
    const hasTransparent = homeHtml.includes('background: transparent');
    const hasStrengthClub = homeHtml.includes('STRENGTH CLUB');
    const hasLiftTheWorld = homeHtml.includes('LIFT THE WORLD');
    const hasAnime = homeHtml.includes('ANIME');
    const hasSonOfTheWest = homeHtml.includes('SON OF THE WEST');
    const hasProCoach = homeHtml.includes('PRO COACH');
    const hasProcoachJpg = homeHtml.includes('Procoach-T-Shirt-Green.jpg');

    console.log("Verification results:", {
        hasSvg,
        hasHeight64,
        hasTransparent,
        hasStrengthClub,
        hasLiftTheWorld,
        hasAnime,
        hasSonOfTheWest,
        hasProCoach,
        hasProcoachJpg
    });

    if (hasSvg && hasHeight64 && hasTransparent && hasStrengthClub && hasLiftTheWorld && hasAnime && hasSonOfTheWest && hasProCoach && hasProcoachJpg) {
        console.log("\n========================================================");
        console.log("SUCCESS! Clothing distinct categories & Footer logo are LIVE!");
        console.log("========================================================\n");
    } else {
        console.warn("WARNING: Some elements not found in homeHtml.");
    }
})();
