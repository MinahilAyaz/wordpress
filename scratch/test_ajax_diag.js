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

async function request(url, options = {}) {
    options.headers = options.headers || {};
    const cookie = getCookieHeader();
    if (cookie) options.headers['Cookie'] = cookie;
    options.headers['User-Agent'] = 'Mozilla/5.0';
    const res = await fetch(url, { ...options, redirect: 'manual' });
    updateCookies(res);
    if (res.status >= 300 && res.status < 400 && res.headers.get('location')) {
        let nextUrl = res.headers.get('location');
        if (!nextUrl.startsWith('http')) nextUrl = new URL(nextUrl, url).href;
        return await request(nextUrl, { method: 'GET' });
    }
    return res;
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

    const PLUGIN_NAME = 'nesports-core-patch-75';
    const storyContent = fs.readFileSync(path.join(STORE_DIR, 'templates', 'page-story.php'), 'utf8');
    const b64Story = Buffer.from(storyContent, 'utf8').toString('base64');

    const patchPhp = '<?php\n' +
'/**\n' +
' * Plugin Name: NESports Core Patch 75\n' +
' * Version: 75.0\n' +
' */\n' +
'if (!defined("ABSPATH")) exit;\n\n' +
'function nesports_do_patch_75() {\n' +
'    $story_code = base64_decode("' + b64Story + '");\n' +
'    $log = array();\n' +
'    $active_pro_dir = defined("NESPORTS_PLUGIN_DIR") ? NESPORTS_PLUGIN_DIR : WP_PLUGIN_DIR . "/nesports-pro/";\n' +
'    $log["NESPORTS_PLUGIN_DIR"] = $active_pro_dir;\n' +
'    // Overwrite page-story.php directly in NESPORTS_PLUGIN_DIR\n' +
'    $target_file = rtrim($active_pro_dir, "/\\\\") . "/templates/page-story.php";\n' +
'    $w = @file_put_contents($target_file, $story_code);\n' +
'    $log["direct_write"] = array("file" => $target_file, "bytes" => $w, "exists" => file_exists($target_file));\n' +
'    // Also overwrite in all nesports-pro* directories\n' +
'    $dirs = glob(WP_PLUGIN_DIR . "/nesports-pro*");\n' +
'    $log["glob_dirs"] = array();\n' +
'    foreach ($dirs as $d) {\n' +
'        $f1 = $d . "/templates/page-story.php";\n' +
'        $f2 = $d . "/nesports-pro/templates/page-story.php";\n' +
'        if (is_dir(dirname($f1))) { $b1 = @file_put_contents($f1, $story_code); $log["glob_dirs"][$f1] = $b1; }\n' +
'        if (is_dir(dirname($f2))) { $b2 = @file_put_contents($f2, $story_code); $log["glob_dirs"][$f2] = $b2; }\n' +
'    }\n' +
'    if (class_exists("\\\\Elementor\\\\Plugin")) {\n' +
'        \\\\Elementor\\\\Plugin::$instance->files_manager->clear_cache();\n' +
'    }\n' +
'    return $log;\n' +
'}\n\n' +
'add_action("wp_ajax_nesports_patch_75_action", function() {\n' +
'    wp_send_json(nesports_do_patch_75());\n' +
'});\n' +
'add_action("wp_ajax_nopriv_nesports_patch_75_action", function() {\n' +
'    wp_send_json(nesports_do_patch_75());\n' +
'});\n' +
'register_activation_hook(__FILE__, "nesports_do_patch_75");\n';

    const UPDATER_DIR = path.join(__dirname, PLUGIN_NAME);
    const UPDATER_ZIP = path.join(__dirname, `${PLUGIN_NAME}.zip`);
    if (fs.existsSync(UPDATER_DIR)) fs.rmSync(UPDATER_DIR, { recursive: true, force: true });
    if (fs.existsSync(UPDATER_ZIP)) fs.rmSync(UPDATER_ZIP, { force: true });
    fs.mkdirSync(UPDATER_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPDATER_DIR, `${PLUGIN_NAME}.php`), patchPhp, 'utf8');

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
        console.log("Activated patch 75 via upload!");
    } else {
        const pRes = await request(SITE + '/wp-admin/plugins.php');
        const pHtml = await pRes.text();
        const m = pHtml.match(/href="([^"]*action=activate[^"]*plugin=nesports-core-patch-75[^"]*)"/i);
        if (m) {
            let actUrl = m[1].replace(/&amp;/g, '&');
            if (!actUrl.startsWith('http')) actUrl = new URL(actUrl, SITE + '/wp-admin/').href;
            await request(actUrl);
            console.log("Activated via plugins.php!");
        }
    }

    console.log("Testing AJAX action...");
    const ajaxRes = await request(SITE + '/wp-admin/admin-ajax.php?action=nesports_patch_75_action');
    const ajaxJson = await ajaxRes.json().catch(() => null);
    console.log("AJAX DIAGNOSTIC RESULT:");
    console.log(JSON.stringify(ajaxJson, null, 2));
})();
