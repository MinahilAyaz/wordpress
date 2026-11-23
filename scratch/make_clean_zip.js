const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = path.resolve(__dirname, '..');
const STORE_DIR = path.join(BASE_DIR, 'nesports-pro-store');

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
 * Plugin Name: NE Sports All Pages Engine (V46)
 * Description: Dynamically lists all WordPress pages in NE Sports Store Dashboard with instant View, Edit in WP, and Edit in Elementor buttons.
 * Version: 46.0
 * Author: NE Sports Development Team
 */

if (!defined('ABSPATH')) exit;

function nesports_v46_sync_all_directories() {
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

// Run on init
add_action('init', 'nesports_v46_sync_all_directories', 1);

// Run on activation
register_activation_hook(__FILE__, 'nesports_v46_sync_all_directories');
`;

const singlePhpFile = path.join(__dirname, 'nesports-all-pages-v46.php');
fs.writeFileSync(singlePhpFile, updaterPhp, 'utf8');

const ZIP = path.join(__dirname, 'nesports-all-pages-v46.zip');
if (fs.existsSync(ZIP)) fs.unlinkSync(ZIP);

// Create ZIP with the PHP file directly at root of the zip archive
execSync(`powershell.exe -NoProfile -Command "Compress-Archive -Path '${singlePhpFile}' -DestinationPath '${ZIP}' -Force"`);

console.log("Successfully created clean ZIP with no nested folders:", ZIP);
