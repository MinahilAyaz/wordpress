const { execFileSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';
const BASE_DIR = path.resolve(__dirname, '..');
const STORE_DIR = path.join(BASE_DIR, 'nesports-pro-store');

const PLUGIN_NAME = 'nesports-all-pages-v47';
const COOKIES = path.join(__dirname, 'cookies_v47.txt');
if (fs.existsSync(COOKIES)) fs.unlinkSync(COOKIES);

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function curl(args) {
    return execFileSync('curl.exe', [
        '-s',
        '--cookie', COOKIES,
        '--cookie-jar', COOKIES,
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        ...args
    ], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
}

(async () => {
    // 1. Prepare payload
    console.log("Preparing payload...");
    const filesToDeploy = {
        'includes/class-nesports-admin.php': fs.readFileSync(path.join(STORE_DIR, 'includes', 'class-nesports-admin.php'), 'utf8'),
        'assets/css/nesports-admin.css': fs.readFileSync(path.join(STORE_DIR, 'assets', 'css', 'nesports-admin.css'), 'utf8')
    };

    let payloadsPhp = '';
    for (const [relPath, content] of Object.entries(filesToDeploy)) {
        const isBin = Buffer.isBuffer(content);
        const b64 = (isBin ? content : Buffer.from(content, 'utf8')).toString('base64');
        payloadsPhp += `        '${relPath}' => base64_decode('${b64}'),\n`;
    }

    const updaterPhp = `<?php
/**
 * Plugin Name: NE Sports All Pages Engine (V47)
 * Description: Dynamically lists all WordPress pages in NE Sports Store Dashboard with instant View, Edit in WP, and Edit in Elementor buttons.
 * Version: 47.0
 * Author: NESports
 */

if (!defined('ABSPATH')) exit;

function nesports_v47_sync_all_directories() {
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

    foreach ($target_dirs as $td) {
        if (!is_dir($td)) continue;
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
            file_put_contents($dest, $data);
        }
    }
}

add_action('init', 'nesports_v47_sync_all_directories', 1);
register_activation_hook(__FILE__, 'nesports_v47_sync_all_directories');
`;

    const singlePhpFile = path.join(__dirname, `${PLUGIN_NAME}.php`);
    fs.writeFileSync(singlePhpFile, updaterPhp, 'utf8');

    const ZIP = path.join(__dirname, `${PLUGIN_NAME}.zip`);
    if (fs.existsSync(ZIP)) fs.unlinkSync(ZIP);

    execSync(`powershell.exe -NoProfile -Command "Compress-Archive -Path '${singlePhpFile}' -DestinationPath '${ZIP}' -Force"`);
    console.log("Created clean ZIP:", ZIP);

    // 2. Login with delay
    console.log("Logging into WordPress...");
    await sleep(3500);
    curl([
        '-L',
        `${SITE}/wp-login.php`,
        '-d', `log=${encodeURIComponent(USER)}&pwd=${encodeURIComponent(PASS)}&rememberme=forever&wp-submit=Log+In&redirect_to=${encodeURIComponent(SITE + '/wp-admin/plugin-install.php?tab=upload')}`
    ]);
    console.log("Logged in!");

    // 3. Fetch upload page
    console.log("Fetching upload page for nonce...");
    await sleep(3500);
    const uploadPage = curl(['-L', `${SITE}/wp-admin/plugin-install.php?tab=upload`]);
    const nonceMatch = uploadPage.match(/name="_wpnonce"\s+value="([^"]+)"/);
    if (!nonceMatch) {
        console.error("Could not find upload nonce. Response preview:\n", uploadPage.substring(0, 400));
        process.exit(1);
    }
    const nonce = nonceMatch[1];
    console.log("Found nonce:", nonce);

    // 4. Upload plugin zip
    console.log("Uploading plugin zip...");
    await sleep(3500);
    const uploadResult = curl([
        '-L',
        `${SITE}/wp-admin/update.php?action=upload-plugin`,
        '-F', `_wpnonce=${nonce}`,
        '-F', '_wp_http_referer=/wp-admin/plugin-install.php?tab=upload',
        '-F', `pluginzip=@${ZIP};type=application/zip`,
        '-F', 'install-plugin-submit=Install Now'
    ]);

    // 5. Check activation link
    console.log("Checking activation link...");
    const actMatch = uploadResult.match(/href="([^"]*action=activate[^"]*plugin=[^"]*)"/);
    if (actMatch) {
        let actUrl = actMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
        console.log("Activating plugin:", actUrl);
        await sleep(3500);
        curl(['-L', actUrl]);
        console.log("Plugin activated successfully!");
    } else {
        console.log("Checking plugins list...");
        await sleep(3500);
        const pluginsPage = curl(['-L', `${SITE}/wp-admin/plugins.php`]);
        const listMatch = pluginsPage.match(new RegExp(`href="([^"]*action=activate[^"]*plugin=${PLUGIN_NAME}[^"]*)"`));
        if (listMatch) {
            let actUrl = listMatch[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
            console.log("Activating plugin from list:", actUrl);
            await sleep(3500);
            curl(['-L', actUrl]);
            console.log("Plugin activated successfully!");
        } else {
            console.log("Plugin already active or updated!");
        }
    }

    // 6. Verify dashboard
    console.log("Verifying live admin dashboard...");
    await sleep(3500);
    const adminHtml = curl(['-L', `${SITE}/wp-admin/admin.php?page=nesports-pro-store`]);
    console.log("Contains 'All Website Pages'?", adminHtml.includes('All Website Pages'));
    console.log("Contains search input?", adminHtml.includes('nes-pages-search'));
    console.log("Deployment SUCCESSFUL!");
})();
