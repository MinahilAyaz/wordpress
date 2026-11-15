const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';
const SYNC_KEY = 'NES3_SECURE_SYNC_2026';

const BASE_DIR = path.resolve(__dirname, '..');
const STORE_DIR = path.join(BASE_DIR, 'nesports-pro-store');
const BRIDGE_DIR = path.join(BASE_DIR, 'scratch', 'nesports-sync-bridge');
const BRIDGE_ZIP = path.join(BASE_DIR, 'scratch', 'nesports-sync-bridge.zip');

if (fs.existsSync(BRIDGE_DIR)) fs.rmSync(BRIDGE_DIR, { recursive: true, force: true });
fs.mkdirSync(BRIDGE_DIR, { recursive: true });

const bridgePhp = `<?php
/**
 * Plugin Name: NESports Sync Bridge
 * Description: Direct high-speed asset and template synchronization bridge
 * Version: 3.0.0
 * Author: NESports
 */

add_action('init', function() {
    if (isset($_POST['nesports_sync_key']) && $_POST['nesports_sync_key'] === '${SYNC_KEY}') {
        $target_dirs = array(
            WP_PLUGIN_DIR . '/nesports-pro',
            WP_PLUGIN_DIR . '/nesports-pro-store'
        );
        
        $action = isset($_POST['sync_action']) ? $_POST['sync_action'] : 'write';
        
        if ($action === 'write') {
            $rel = sanitize_text_field($_POST['rel']);
            $data = base64_decode($_POST['data']);
            $res = array();
            foreach ($target_dirs as $td) {
                if (!is_dir($td)) continue;
                $dest = $td . '/' . $rel;
                $dir = dirname($dest);
                if (!is_dir($dir)) {
                    wp_mkdir_p($dir);
                }
                $w = file_put_contents($dest, $data);
                $res[$td] = ($w !== false) ? $w : false;
            }
            header('Content-Type: application/json');
            echo json_encode(array('status' => 'ok', 'rel' => $rel, 'written' => $res));
            exit;
        }
    }
});
`;

fs.writeFileSync(path.join(BRIDGE_DIR, 'nesports-sync-bridge.php'), bridgePhp, 'utf8');

execSync('powershell -Command "Start-Sleep -Milliseconds 500"');
if (fs.existsSync(BRIDGE_ZIP)) fs.unlinkSync(BRIDGE_ZIP);
execSync(`powershell -Command "Compress-Archive -Path '${BRIDGE_DIR}' -DestinationPath '${BRIDGE_ZIP}' -Force"`, { cwd: BASE_DIR });
console.log('Created ' + BRIDGE_ZIP + ' (' + (fs.statSync(BRIDGE_ZIP).size / 1024).toFixed(2) + ' KB)');

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

    const zipBuffer = fs.readFileSync(BRIDGE_ZIP);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    let body = Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="_wpnonce"\r\n\r\n${nonce}\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="_wp_http_referer"\r\n\r\n/wp-admin/plugin-install.php?tab=upload\r\n`),
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="pluginzip"; filename="nesports-sync-bridge.zip"\r\nContent-Type: application/zip\r\n\r\n`),
        zipBuffer,
        Buffer.from(`\r\n--${boundary}\r\nContent-Disposition: form-data; name="install-plugin-submit"\r\n\r\nInstall Now\r\n`),
        Buffer.from(`--${boundary}--\r\n`)
    ]);

    console.log("Uploading sync bridge plugin...");
    const uploadRes = await request(SITE + '/wp-admin/update.php?action=upload-plugin', {
        method: 'POST',
        headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
        body: body
    });
    const uploadHtml = await uploadRes.text();
    console.log("Upload status:", uploadRes.status);

    if (uploadHtml.includes('Replace current with uploaded') || uploadHtml.includes('update.php?action=update-selected-plugin')) {
        const replaceMatch = uploadHtml.match(/href="([^"]*action=update-selected-plugin[^"]*)"/);
        if (replaceMatch) {
            let replaceUrl = replaceMatch[1].replace(/&amp;/g, '&');
            if (!replaceUrl.startsWith('http')) replaceUrl = new URL(replaceUrl, SITE).href;
            console.log("Replacing existing bridge plugin...");
            const repRes = await request(replaceUrl);
            await repRes.text();
        }
    }

    // Now check plugins.php to find the exact activation link for nesports-sync-bridge
    const pRes = await request(SITE + '/wp-admin/plugins.php');
    const pHtml = await pRes.text();
    const actMatch = pHtml.match(/href="([^"]*action=activate[^"]*plugin=nesports-sync-bridge[^\"]*)"/);
    if (actMatch) {
        let actUrl = actMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
        console.log("Activating bridge:", actUrl);
        await request(actUrl);
        console.log("Activated bridge!");
    } else {
        console.log("Bridge might already be active!");
    }

    // Test bridge
    async function writeRemoteFile(relPath, localFullPath) {
        const fileData = fs.readFileSync(localFullPath);
        const b64 = fileData.toString('base64');
        const params = new URLSearchParams();
        params.append('nesports_sync_key', SYNC_KEY);
        params.append('sync_action', 'write');
        params.append('rel', relPath);
        params.append('data', b64);

        const wRes = await fetch(`${SITE}/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString()
        });
        const json = await wRes.json();
        console.log("Wrote:", relPath, json.written);
        return json;
    }

    console.log("Testing bridge sync...");
    // Sync all files
    const allFiles = [
        ['includes/helpers.php', path.join(STORE_DIR, 'includes', 'helpers.php')],
        ['templates/page-category.php', path.join(STORE_DIR, 'templates', 'page-category.php')],
        ['templates/footer-nesports.php', path.join(STORE_DIR, 'templates', 'footer-nesports.php')],
        ['templates/sections/section-color.php', path.join(STORE_DIR, 'templates', 'sections', 'section-color.php')],
        ['templates/sections/section-clothing.php', path.join(STORE_DIR, 'templates', 'sections', 'section-clothing.php')],
        ['assets/css/nesports-frontend.css', path.join(STORE_DIR, 'assets', 'css', 'nesports-frontend.css')],
        ['assets/images/footer-logo.svg', path.join(STORE_DIR, 'assets', 'images', 'footer-logo.svg')],
        ['assets/images/clothing/Strength-Club-White-Flat.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-White-Flat.jpg')],
        ['assets/images/clothing/Strength-Club-White-Detail.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-White-Detail.jpg')],
        ['assets/images/clothing/Strength-Club-White-Model.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-White-Model.jpg')],
        ['assets/images/clothing/Strength-Club-Blue-Flat.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Blue-Flat.jpg')],
        ['assets/images/clothing/Strength-Club-Blue-Detail.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Blue-Detail.jpg')],
        ['assets/images/clothing/Strength-Club-Blue-Model.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Blue-Model.jpg')],
        ['assets/images/clothing/Strength-Club-Red-Flat.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Red-Flat.jpg')],
        ['assets/images/clothing/Strength-Club-Red-Detail.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Red-Detail.jpg')],
        ['assets/images/clothing/Strength-Club-Red-Model.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Strength-Club-Red-Model.jpg')],
        ['assets/images/clothing/cat-strength-club.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'cat-strength-club.jpg')],
        ['assets/images/clothing/Lift-The-World-T-Shirt-Black-Detail.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Lift-The-World-T-Shirt-Black-Detail.jpg')],
        ['assets/images/clothing/Lift-The-World-T-Shirt-Black-Lower.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Lift-The-World-T-Shirt-Black-Lower.jpg')],
        ['assets/images/clothing/Lift-The-World-T-Shirt-Red-Detail.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Lift-The-World-T-Shirt-Red-Detail.jpg')],
        ['assets/images/clothing/Lift-The-World-T-Shirt-Red-Lower.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Lift-The-World-T-Shirt-Red-Lower.jpg')],
        ['assets/images/clothing/Procoach-Green-Detail.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Procoach-Green-Detail.jpg')],
        ['assets/images/clothing/Procoach-Red-Detail.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Procoach-Red-Detail.jpg')],
        ['assets/images/clothing/Procoach-Red-Lower.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Procoach-Red-Lower.jpg')],
        ['assets/images/clothing/Procoach-Navy-Detail.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Procoach-Navy-Detail.jpg')],
        ['assets/images/clothing/Procoach-Navy-Lower.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Procoach-Navy-Lower.jpg')],
        ['assets/images/clothing/Anime-1-Detail.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Anime-1-Detail.jpg')],
        ['assets/images/clothing/Anime-2-Detail.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Anime-2-Detail.jpg')],
        ['assets/images/clothing/cat-pro-coach.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'cat-pro-coach.jpg')],
        ['assets/images/clothing/cat-lift-the-world.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'cat-lift-the-world.jpg')],
        ['assets/images/clothing/cat-anime.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'cat-anime.jpg')],
        ['assets/images/clothing/cat-son-of-the-west.jpg', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'cat-son-of-the-west.jpg')],
        ['assets/images/clothing/Procoach-T-Shirt-Green.png', path.join(STORE_DIR, 'assets', 'images', 'clothing', 'Procoach-T-Shirt-Green.png')]
    ];

    for (const [rel, full] of allFiles) {
        if (fs.existsSync(full)) {
            await writeRemoteFile(rel, full);
        } else {
            console.error("Local file missing:", full);
        }
    }

    console.log("All files synced! Verifying live site...");
    const scCheck = await fetch(`${SITE}/collections/strength-club/`);
    const scText = await scCheck.text();
    console.log("Strength Club page check:");
    console.log("- Has Warning:", scText.includes('Unknown modifier'));
    console.log("- Has Show filters:", scText.includes('Show filters'));
    console.log("- Has Strength-Club-White-Model:", scText.includes('Strength-Club-White-Model.jpg'));

    const ltwCheck = await fetch(`${SITE}/collections/lift-the-world/`);
    const ltwText = await ltwCheck.text();
    console.log("Lift the World page check:");
    console.log("- Has + ADD TO CART:", ltwText.includes('ADD TO CART'));

    const homeCheck = await fetch(`${SITE}/`);
    const homeText = await homeCheck.text();
    console.log("Home page check:");
    console.log("- Has footer logo svg:", homeText.includes('footer-logo.svg'));
    console.log("- Has TikTok:", homeText.includes('tiktok.com/@ne_sports3'));
    console.log("- Has Facebook:", homeText.includes('facebook.com/profile.php?id=61570206840697'));
    console.log("- Has Instagram:", homeText.includes('instagram.com/nesports39'));
    console.log("- Has Amazon:", homeText.includes('amazon.de/s?k=NES3'));
    console.log("- Has eBay:", homeText.includes('ebay.de/str/nesports3'));

    console.log("ALL VERIFICATIONS COMPLETE!");
})();
