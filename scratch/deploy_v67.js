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
    if (!headers.length && res.headers.get('set-cookie')) headers.push(res.headers.get('set-cookie'));
    for (const raw of headers) {
        for (const part of raw.split(/,(?=[^;]+=)/)) {
            const first = part.split(';')[0].trim();
            const idx = first.indexOf('=');
            if (idx > 0) cookieJar[first.substring(0, idx).trim()] = first.substring(idx + 1).trim();
        }
    }
}
function getCookieHeader() {
    return Object.entries(cookieJar).map(([k, v]) => k + '=' + v).join('; ');
}

async function request(url, options = {}, retries = 5) {
    options.headers = options.headers || {};
    const cookie = getCookieHeader();
    if (cookie) options.headers['Cookie'] = cookie;
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36';
    await new Promise(r => setTimeout(r, 1000));
    try {
        const res = await fetch(url, { ...options, redirect: 'manual' });
        updateCookies(res);
        if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
            let nextUrl = res.headers.get('location');
            if (!nextUrl.startsWith('http')) nextUrl = new URL(nextUrl, url).href;
            return await request(nextUrl, { method: 'GET' }, retries);
        }
        return res;
    } catch (err) {
        if (retries > 0) {
            await new Promise(r => setTimeout(r, 3000));
            return request(url, options, retries - 1);
        }
        throw err;
    }
}

(async () => {
    await request(SITE + '/wp-login.php');
    const formParams = new URLSearchParams();
    formParams.append('log', USER);
    formParams.append('pwd', PASS);
    formParams.append('rememberme', 'forever');
    formParams.append('wp-submit', 'Log In');
    await request(SITE + '/wp-login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
    });

    const PLUGIN_NAME = 'nesports-updater-v67';
    const filesToDeploy = {
        'templates/page-story.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'page-story.php'), 'utf8')
    };

    let payloadsPhp = '';
    for (const [relPath, content] of Object.entries(filesToDeploy)) {
        const b64 = Buffer.from(content, 'utf8').toString('base64');
        payloadsPhp += `        '${relPath}' => base64_decode('${b64}'),\n`;
    }

    const updaterPhp = `<?php
/**
 * Plugin Name: NESPORTS3 Updater V67
 * Version: 67.0
 */
if (!defined('ABSPATH')) exit;
function run_nesports_v67_sync() {
    $target_dirs = array(
        WP_PLUGIN_DIR . '/nesports-pro',
        WP_PLUGIN_DIR . '/nesports-pro-store',
        WP_PLUGIN_DIR . '/nesports-custom'
    );
    $payloads = array(${payloadsPhp});
    foreach ($target_dirs as $td) {
        if (!is_dir($td)) continue;
        foreach ($payloads as $rel => $data) {
            $dest = $td . '/' . $rel;
            @mkdir(dirname($dest), 0755, true);
            file_put_contents($dest, $data);
        }
    }
    // Clean old updaters
    $active = get_option('active_plugins', array());
    if (is_array($active)) {
        $clean = array_filter($active, function($p) { return stripos($p, 'updater-v') === false; });
        update_option('active_plugins', array_values($clean));
    }
    if (class_exists('\\Elementor\\Plugin')) {
        \\Elementor\\Plugin::$instance->files_manager->clear_cache();
    }
    return array('status' => 'ok');
}
add_action('init', function() {
    if (isset($_GET['nesports_apply_v67'])) {
        header('Content-Type: application/json');
        echo json_encode(run_nesports_v67_sync());
        exit;
    }
    if (isset($_GET['nesports_diag_story'])) {
        header('Content-Type: text/plain');
        $p30090 = get_post(30090);
        $p4400 = get_post(4400);
        echo "=== POST 30090 ===\n";
        echo "title: " . ($p30090 ? $p30090->post_title : 'none') . "\n";
        echo "status: " . ($p30090 ? $p30090->post_status : 'none') . "\n";
        echo "content_len: " . ($p30090 ? strlen($p30090->post_content) : 0) . "\n";
        echo "elementor_edit_mode: " . get_post_meta(30090, '_elementor_edit_mode', true) . "\n";
        $d30090 = get_post_meta(30090, '_elementor_data', true);
        echo "elementor_data_len: " . strlen($d30090) . "\n";
        echo "elementor_data_snippet: " . substr($d30090, 0, 300) . "\n";
        if (class_exists('\\Elementor\\Plugin')) {
            $doc = \\Elementor\\Plugin::$instance->documents->get(30090);
            echo "doc_exists: " . ($doc ? 'yes' : 'no') . "\n";
            if ($doc) {
                echo "doc_is_built: " . ($doc->is_built_with_elementor() ? 'yes' : 'no') . "\n";
            }
            $disp = \\Elementor\\Plugin::$instance->frontend->get_builder_content_for_display(30090);
            echo "get_builder_content_for_display_len: " . strlen($disp) . "\n";
            $raw = \\Elementor\\Plugin::$instance->frontend->get_builder_content(30090);
            echo "get_builder_content_len: " . strlen($raw) . "\n";
        }
        echo "\n=== POST 4400 ===\n";
        echo "title: " . ($p4400 ? $p4400->post_title : 'none') . "\n";
        echo "status: " . ($p4400 ? $p4400->post_status : 'none') . "\n";
        echo "content_len: " . ($p4400 ? strlen($p4400->post_content) : 0) . "\n";
        echo "elementor_edit_mode: " . get_post_meta(4400, '_elementor_edit_mode', true) . "\n";
        $d4400 = get_post_meta(4400, '_elementor_data', true);
        echo "elementor_data_len: " . strlen($d4400) . "\n";
        echo "elementor_data_snippet: " . substr($d4400, 0, 300) . "\n";
        if (class_exists('\\Elementor\\Plugin')) {
            $disp4 = \\Elementor\\Plugin::$instance->frontend->get_builder_content_for_display(4400);
            echo "4400_display_len: " . strlen($disp4) . "\n";
            $raw4 = \\Elementor\\Plugin::$instance->frontend->get_builder_content(4400);
            echo "4400_raw_len: " . strlen($raw4) . "\n";
        }
        exit;
    }
    run_nesports_v67_sync();
}, 1);
register_activation_hook(__FILE__, 'run_nesports_v67_sync');
`;

    const UPDATER_DIR = path.join(__dirname, PLUGIN_NAME);
    const UPDATER_ZIP = path.join(__dirname, `${PLUGIN_NAME}.zip`);
    if (fs.existsSync(UPDATER_DIR)) fs.rmSync(UPDATER_DIR, { recursive: true, force: true });
    if (fs.existsSync(UPDATER_ZIP)) fs.rmSync(UPDATER_ZIP, { force: true });
    fs.mkdirSync(UPDATER_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPDATER_DIR, `${PLUGIN_NAME}.php`), updaterPhp, 'utf8');

    execSync(`powershell -ExecutionPolicy Bypass -File scratch\\make_zip.ps1 -sourceDir "${UPDATER_DIR}" -zipPath "${UPDATER_ZIP}"`, { cwd: BASE_DIR });

    const installRes = await request(SITE + '/wp-admin/plugin-install.php?tab=upload');
    const installHtml = await installRes.text();
    const nonceMatch = installHtml.match(/name="_wpnonce"\s+value="([a-f0-9]+)"/i);
    const nonce = nonceMatch[1];

    const zipBuffer = fs.readFileSync(UPDATER_ZIP);
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const crlf = '\r\n';
    let pre = `--${boundary}${crlf}Content-Disposition: form-data; name="_wpnonce"${crlf}${crlf}${nonce}${crlf}--${boundary}${crlf}Content-Disposition: form-data; name="_wp_http_referer"${crlf}${crlf}/wp-admin/plugin-install.php?tab=upload${crlf}--${boundary}${crlf}Content-Disposition: form-data; name="pluginzip"; filename="${PLUGIN_NAME}.zip"${crlf}Content-Type: application/zip${crlf}${crlf}`;
    let post = `${crlf}--${boundary}--${crlf}`;
    const body = Buffer.concat([Buffer.from(pre, 'utf8'), zipBuffer, Buffer.from(post, 'utf8')]);

    const uploadRes = await request(SITE + '/wp-admin/update.php?action=upload-plugin', {
        method: 'POST',
        headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
        body: body
    });
    const uploadHtml = await uploadRes.text();
    const actMatch = uploadHtml.match(/href="([^"]*action=activate[^"]*)"/i);
    if (actMatch) {
        let actUrl = actMatch[1].replace(/&amp;/g, '&');
        if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
        await request(actUrl);
    }
    await request(SITE + '/?nesports_apply_v67=1');
    console.log("Deployed V67 successfully!");

    const diagRes = await fetch(SITE + '/?nesports_diag_story=1');
    const diagText = await diagRes.text();
    console.log("=== DIAGNOSTIC RESULT ===");
    console.log(diagText);

    // Now fetch /our-story/ and print debug comment
    const storyRes = await fetch(SITE + '/our-story/');
    const storyHtml = await storyRes.text();
    const dbgMatch = storyHtml.match(/<!-- DEBUG_STORY:.*?-->/);
    console.log("DEBUG_STORY MATCH:", dbgMatch ? dbgMatch[0] : 'no debug match');
})();
