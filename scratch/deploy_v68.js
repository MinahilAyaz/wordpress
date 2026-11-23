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
    options.headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0.0.0 Safari/537.36';
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
    console.log("1. Logging into WordPress...");
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

    const PLUGIN_NAME = 'nesports-updater-v68';
    const filesToDeploy = {
        'includes/class-nesports-admin.php': fs.readFileSync(path.join(STORE_DIR, 'includes', 'class-nesports-admin.php'), 'utf8'),
        'templates/page-story.php': fs.readFileSync(path.join(STORE_DIR, 'templates', 'page-story.php'), 'utf8')
    };

    let payloadsPhp = '';
    for (const [relPath, content] of Object.entries(filesToDeploy)) {
        const b64 = Buffer.from(content, 'utf8').toString('base64');
        payloadsPhp += `        '${relPath}' => base64_decode('${b64}'),\n`;
    }

    const updaterPhp = '<?php\n' +
'/**\n' +
' * Plugin Name: NESPORTS3 Updater V68\n' +
' * Version: 68.0\n' +
' */\n' +
'if (!defined("ABSPATH")) exit;\n\n' +
'function run_nesports_v68_sync() {\n' +
'    $target_dirs = array(\n' +
'        WP_PLUGIN_DIR . "/nesports-pro",\n' +
'        WP_PLUGIN_DIR . "/nesports-pro-store",\n' +
'        WP_PLUGIN_DIR . "/nesports-custom"\n' +
'    );\n' +
'    $payloads = array(\n' +
payloadsPhp +
'    );\n' +
'    foreach ($target_dirs as $td) {\n' +
'        if (!is_dir($td)) continue;\n' +
'        foreach ($payloads as $rel => $data) {\n' +
'            $dest = $td . "/" . $rel;\n' +
'            @mkdir(dirname($dest), 0755, true);\n' +
'            file_put_contents($dest, $data);\n' +
'        }\n' +
'    }\n' +
'    $raw_data = get_post_meta(30090, "_elementor_data", true);\n' +
'    if (!empty($raw_data)) {\n' +
'        $elements = json_decode($raw_data, true);\n' +
'        if (is_array($elements)) {\n' +
'            $found = false;\n' +
'            $updates = array();\n' +
'            $scan = function($items) use (&$scan, &$updates, &$found) {\n' +
'                foreach ($items as $item) {\n' +
'                    if (isset($item["widgetType"]) && in_array($item["widgetType"], array("nesports-story", "nesports_story_widget"), true)) {\n' +
'                        $st = $item["settings"] ?? array();\n' +
'                        if (isset($st["story_text"]) && $st["story_text"] !== "") { $updates["about_story_text"] = $st["story_text"]; $found = true; }\n' +
'                        if (isset($st["banner_title"]) && $st["banner_title"] !== "") { $updates["about_banner_title"] = $st["banner_title"]; $found = true; }\n' +
'                        if (isset($st["story_title"]) && $st["story_title"] !== "") { $updates["about_story_title"] = $st["story_title"]; $found = true; }\n' +
'                        if (!empty($st["image"]["url"])) { $updates["about_feature_img"] = $st["image"]["url"]; $found = true; }\n' +
'                        if (isset($st["motto"]) && $st["motto"] !== "") { $updates["about_motto"] = $st["motto"]; $found = true; }\n' +
'                    }\n' +
'                    if (!empty($item["elements"]) && is_array($item["elements"])) {\n' +
'                        $scan($item["elements"]);\n' +
'                    }\n' +
'                }\n' +
'            };\n' +
'            $scan($elements);\n' +
'            if ($found && !empty($updates)) {\n' +
'                $cur = get_option("nesports_store_settings", array());\n' +
'                $merged = array_merge($cur, $updates);\n' +
'                update_option("nesports_store_settings", $merged);\n' +
'            }\n' +
'        }\n' +
'    }\n' +
'    if (class_exists("\\\\Elementor\\\\Plugin")) {\n' +
'        \\\\Elementor\\\\Plugin::$instance->files_manager->clear_cache();\n' +
'    }\n' +
'    return array("status" => "ok", "synced" => isset($found) ? $found : false);\n' +
'}\n\n' +
'add_action("init", function() {\n' +
'    if (isset($_GET["nesports_apply_v68"])) {\n' +
'        header("Content-Type: application/json");\n' +
'        echo json_encode(run_nesports_v68_sync());\n' +
'        exit;\n' +
'    }\n' +
'    run_nesports_v68_sync();\n' +
'}, 1);\n\n' +
'register_activation_hook(__FILE__, "run_nesports_v68_sync");\n';

    const UPDATER_DIR = path.join(__dirname, PLUGIN_NAME);
    const UPDATER_ZIP = path.join(__dirname, `${PLUGIN_NAME}.zip`);
    if (fs.existsSync(UPDATER_DIR)) fs.rmSync(UPDATER_DIR, { recursive: true, force: true });
    if (fs.existsSync(UPDATER_ZIP)) fs.rmSync(UPDATER_ZIP, { force: true });
    fs.mkdirSync(UPDATER_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPDATER_DIR, `${PLUGIN_NAME}.php`), updaterPhp, 'utf8');

    console.log("2. Creating zip package...");
    execSync(`powershell -ExecutionPolicy Bypass -File scratch\\make_zip.ps1 -sourceDir "${UPDATER_DIR}" -zipPath "${UPDATER_ZIP}"`, { cwd: BASE_DIR });

    console.log("3. Uploading plugin...");
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

    console.log("4. Applying v68 sync...");
    const syncRes = await request(SITE + '/?nesports_apply_v68=1');
    const syncJson = await syncRes.json().catch(() => null);
    console.log("Sync response:", syncJson);

    console.log("5. Checking live /our-story/ page...");
    const storyRes = await fetch(SITE + '/our-story/');
    const storyHtml = await storyRes.text();
    const idx = storyHtml.indexOf('hb-about-text-col');
    console.log(storyHtml.substring(idx, idx + 400));
})();
