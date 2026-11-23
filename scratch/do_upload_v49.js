const { execFileSync, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SITE = 'https://www.nesports3.com';
const USER = 'NESports';
const PASS = 'NES3@1122$PK';
const BASE_DIR = path.resolve(__dirname, '..');
const STORE_DIR = path.join(BASE_DIR, 'nesports-pro-store');

const PLUGIN_NAME = 'nesports-updater-v49';
const COOKIES = path.join(__dirname, 'cookies_v49.txt');

function curl(args) {
    try {
        return execFileSync('curl.exe', [
            '--http1.1',
            '-s',
            '-b', COOKIES,
            '-c', COOKIES,
            '-A', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
            ...args
        ], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });
    } catch (e) {
        if (e.stdout && typeof e.stdout === 'string' && e.stdout.length > 0) {
            return e.stdout;
        }
        throw e;
    }
}

// 1. Prepare single file ZIP
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
 * Plugin Name: NESPORTS3 All Pages Live Engine (V49)
 * Description: Dynamically lists all WordPress pages in NE Sports Store Dashboard with instant View, Edit in WP, and Edit in Elementor buttons.
 * Version: 49.0
 * Author: NESports
 */

if (!defined('ABSPATH')) exit;

function nesports_v49_sync_all() {
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
    if (isset($_GET['nesports_apply_v49']) && $_GET['nesports_apply_v49'] === '1') {
        $res = nesports_v49_sync_all();
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'ok', 'results' => $res));
        exit;
    }
    nesports_v49_sync_all();
}, 1);

register_activation_hook(__FILE__, 'nesports_v49_sync_all');
`;

const singlePhpFile = path.join(__dirname, `${PLUGIN_NAME}.php`);
fs.writeFileSync(singlePhpFile, updaterPhp, 'utf8');

const ZIP = path.join(__dirname, `${PLUGIN_NAME}.zip`);
if (fs.existsSync(ZIP)) fs.unlinkSync(ZIP);

execSync(`powershell.exe -NoProfile -Command "Compress-Archive -Path '${singlePhpFile}' -DestinationPath '${ZIP}' -Force"`);
console.log("ZIP file ready:", ZIP);

// Verify or Login
console.log("1. Checking login status or refreshing session...");
const testDash = curl(['-L', `${SITE}/wp-admin/`]);
if (!testDash.includes('Dashboard')) {
    console.log("Session not logged in, performing login...");
    curl(['-L', `${SITE}/wp-login.php`]);
    curl([
        '-L',
        `${SITE}/wp-login.php`,
        '-d', `log=${encodeURIComponent(USER)}&pwd=${encodeURIComponent(PASS)}&rememberme=forever&wp-submit=Log+In&redirect_to=${encodeURIComponent(SITE + '/wp-admin/')}`
    ]);
}
console.log("Logged in!");

// Step 2: GET upload page
console.log("2. Fetching plugin upload page for nonce...");
const uploadPage = curl(['-L', `${SITE}/wp-admin/plugin-install.php?tab=upload`]);
const nonceMatch = uploadPage.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
if (!nonceMatch) {
    console.error("Could not find upload nonce. Page preview:\n", uploadPage.substring(0, 500));
    process.exit(1);
}
const nonce = nonceMatch[1];
console.log("Found nonce:", nonce);

// Step 3: Upload plugin zip
console.log("3. Uploading plugin zip:", ZIP);
const uploadResult = curl([
    '-L',
    `${SITE}/wp-admin/update.php?action=upload-plugin`,
    '-F', `_wpnonce=${nonce}`,
    '-F', '_wp_http_referer=/wp-admin/plugin-install.php?tab=upload',
    '-F', `pluginzip=@${ZIP};type=application/zip`,
    '-F', 'install-plugin-submit=Install Now'
]);

console.log("Upload result preview:\n", uploadResult.substring(0, 400));

// Step 4: Activate plugin
console.log("4. Activating plugin...");
const actMatch = uploadResult.match(/href="([^"]*action=activate[^"]*)"/);
if (actMatch) {
    let actUrl = actMatch[1].replace(/&amp;/g, '&');
    if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
    console.log("Activating plugin via link:", actUrl);
    const actRes = curl(['-L', actUrl]);
    console.log("Activation result preview:", actRes.substring(0, 300));
} else {
    console.log("Searching in plugins list...");
    const pluginsPage = curl(['-L', `${SITE}/wp-admin/plugins.php`]);
    const listMatch = pluginsPage.match(new RegExp(`href="([^"]*action=activate[^"]*plugin=${PLUGIN_NAME}[^"]*)"`));
    if (listMatch) {
        let actUrl = listMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = `${SITE}/wp-admin/${actUrl.replace(/^\//, '')}`;
        console.log("Activating plugin from list:", actUrl);
        curl(['-L', actUrl]);
        console.log("Plugin activated from list!");
    } else {
        console.log("Note: Plugin might already be active or updated.");
    }
}

// Step 5: Verify sync hook
console.log("5. Triggering sync hook: ?nesports_apply_v49=1...");
const hookRes = curl(['-L', `${SITE}/?nesports_apply_v49=1`]);
console.log("Sync Hook Response:", hookRes);

// Step 6: Verify live admin dashboard
console.log("6. Verifying live admin dashboard...");
const adminHtml = curl(['-L', `${SITE}/wp-admin/admin.php?page=nesports-pro-store`]);
console.log("Has 'All Website Pages'?", adminHtml.includes('All Website Pages'));
console.log("Has search input 'nes-pages-search'?", adminHtml.includes('nes-pages-search'));
console.log("Has 'Pages Available'?", adminHtml.includes('Pages Available'));

if (adminHtml.includes('All Website Pages')) {
    console.log("\n========================================================");
    console.log("🎉 SUCCESS: LIVE DASHBOARD UPDATED WITH ALL WEBSITE PAGES!");
    console.log("========================================================");
}
