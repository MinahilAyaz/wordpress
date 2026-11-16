<?php
/**
 * Plugin Name: NESports Auto Updater V17
 * Description: Deploys 45 professional bundle images (model action shots + studio product compositions) with 3-dot hover scrubber.
 * Version: 17.0.0
 * Author: NESports
 */

function nesports_copy_recursive($src, $dst) {
    if (!is_dir($src)) return false;
    $dir = opendir($src);
    @mkdir($dst, 0755, true);
    while (false !== ($file = readdir($dir))) {
        if (($file != '.') && ($file != '..')) {
            if (is_dir($src . '/' . $file)) {
                nesports_copy_recursive($src . '/' . $file, $dst . '/' . $file);
            } else {
                copy($src . '/' . $file, $dst . '/' . $file);
            }
        }
    }
    closedir($dir);
    return true;
}

function run_nesports_v17_update() {
    $src = __DIR__ . '/payload';
    $target_dirs = array(
        WP_PLUGIN_DIR . '/nesports-pro',
        WP_PLUGIN_DIR . '/nesports-pro-store'
    );
    $results = array();
    foreach ($target_dirs as $td) {
        if (!is_dir($td)) continue;
        $ok = nesports_copy_recursive($src, $td);
        $results[$td] = $ok ? 'SUCCESS' : 'ERROR';
    }
    return $results;
}

add_action('init', function() {
    if (isset($_GET['nesports_apply_v17']) && $_GET['nesports_apply_v17'] === '1') {
        $res = run_nesports_v17_update();
        header('Content-Type: application/json');
        echo json_encode(array('status' => 'ok', 'results' => $res));
        exit;
    }
});

register_activation_hook(__FILE__, function() {
    run_nesports_v17_update();
});
