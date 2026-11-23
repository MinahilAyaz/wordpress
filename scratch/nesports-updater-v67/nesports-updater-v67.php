<?php
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
    $payloads = array(        'templates/page-story.php' => base64_decode('PD9waHANCi8qKg0KICogTkVTUE9SVFMzIC0gQWJvdXQgVXMgUGFnZSBUZW1wbGF0ZQ0KICogRXh0cmFjdGVkIGRpcmVjdGx5IGZyb20gb2ZmaWNpYWwgd2Vic2l0ZSByZWZlcmVuY2UNCiAqLw0KJGN1cnJlbnRfcGFnZSA9ICdhYm91dCc7DQppbmNsdWRlIE5FU1BPUlRTX1BMVUdJTl9ESVIgLiAndGVtcGxhdGVzL2hlYWRlci1uZXNwb3J0cy5waHAnOw0KDQokcGFnZV9pZCA9IGdldF9xdWVyaWVkX29iamVjdF9pZCgpOw0KaWYgKCEkcGFnZV9pZCkgew0KICAgICRwYWdlX2lkID0gZ2V0X3RoZV9JRCgpOw0KfQ0KaWYgKCEkcGFnZV9pZCkgew0KICAgICRwYWdlX2lkID0gMzAwOTA7DQp9DQoNCiRlbGVtZW50b3JfaHRtbCA9ICcnOw0KaWYgKGNsYXNzX2V4aXN0cygnXEVsZW1lbnRvclxQbHVnaW4nKSAmJiAkcGFnZV9pZCkgew0KICAgICRlbGVtZW50b3JfaHRtbCA9IFxFbGVtZW50b3JcUGx1Z2luOjokaW5zdGFuY2UtPmZyb250ZW5kLT5nZXRfYnVpbGRlcl9jb250ZW50X2Zvcl9kaXNwbGF5KCRwYWdlX2lkKTsNCn0NCg0KJG1fZGF0YSA9IGdldF9wb3N0X21ldGEoJHBhZ2VfaWQsICdfZWxlbWVudG9yX2RhdGEnLCB0cnVlKTsNCiRtX2VkaXQgPSBnZXRfcG9zdF9tZXRhKCRwYWdlX2lkLCAnX2VsZW1lbnRvcl9lZGl0X21vZGUnLCB0cnVlKTsNCiRtX3N0YXR1cyA9IGdldF9wb3N0X3N0YXR1cygkcGFnZV9pZCk7DQoNCmVjaG8gJzwhLS0gREVCVUdfU1RPUlk6IHBhZ2VfaWQ9JyAuICRwYWdlX2lkIC4gJyBwbHVnaW5fbG9hZGVkPScgLiAoY2xhc3NfZXhpc3RzKCdcRWxlbWVudG9yXFBsdWdpbicpID8gJ3llcycgOiAnbm8nKSAuICcgaHRtbF9sZW49JyAuIHN0cmxlbigkZWxlbWVudG9yX2h0bWwpIC4gJyBkYXRhX2xlbj0nIC4gc3RybGVuKCRtX2RhdGEpIC4gJyBlZGl0X21vZGU9JyAuICRtX2VkaXQgLiAnIHN0YXR1cz0nIC4gJG1fc3RhdHVzIC4gJyAtLT4nOw0KDQppZiAoIWVtcHR5KCRlbGVtZW50b3JfaHRtbCkpIDoNCj8+DQo8bWFpbiBjbGFzcz0iaGItYWJvdXQtcGFnZSI+DQogICAgPD9waHAgZWNobyAkZWxlbWVudG9yX2h0bWw7ID8+DQo8L21haW4+DQo8P3BocCBlbHNlIDogPz4NCjxtYWluIGNsYXNzPSJoYi1hYm91dC1wYWdlIj4NCiAgICA8IS0tIFRvcCBCbGFjayBIZWFkZXIgQmFubmVyIE1hdGNoaW5nIFNjcmVlbnNob3QgLS0+DQogICAgPHNlY3Rpb24gY2xhc3M9ImhiLWFib3V0LWhlcm8tYmFubmVyIj4NCiAgICAgICAgPGgxIGNsYXNzPSJoYi1hYm91dC1iYW5uZXItdGl0bGUiPjw/cGhwIGVjaG8gZXNjX2h0bWwobmVzcG9ydHNfc2V0dGluZygnYWJvdXRfYmFubmVyX3RpdGxlJywgJ0Fib3V0IFVzJykpOyA/PjwvaDE+DQogICAgPC9zZWN0aW9uPg0KDQogICAgPCEtLSBNYWluIEFib3V0IENvbnRlbnQgR3JpZCAtLT4NCiAgICA8c2VjdGlvbiBjbGFzcz0iaGItYWJvdXQtY29udGVudC1zZWN0aW9uIj4NCiAgICAgICAgPGRpdiBjbGFzcz0iaGItYWJvdXQtY29udGFpbmVyIj4NCiAgICAgICAgICAgIDxkaXYgY2xhc3M9ImhiLWFib3V0LXR3by1jb2wiPg0KICAgICAgICAgICAgICAgIDwhLS0gTGVmdDogQXRobGV0ZSBQaG90byAtLT4NCiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSJoYi1hYm91dC1tZWRpYS1jb2wiPg0KICAgICAgICAgICAgICAgICAgICA8P3BocCANCiAgICAgICAgICAgICAgICAgICAgJGFib3V0X2ltZyA9IG5lc3BvcnRzX3NldHRpbmcoJ2Fib3V0X2ZlYXR1cmVfaW1nJywgJ1doYXRzQXBwLUltYWdlLTIwMjQtMDctMDgtYXQtMTkuMTcuNTBfZjljNDdkN2ItODAweDUzMC5qcGcnKTsNCiAgICAgICAgICAgICAgICAgICAgPz4NCiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9Ijw/cGhwIGVjaG8gZXNjX3VybChuZXNwb3J0c19pbWcoJGFib3V0X2ltZykpOyA/PiIgYWx0PSJORSBTcG9ydHMzIEF0aGxldGVzIiBjbGFzcz0iaGItYWJvdXQtZmVhdHVyZS1pbWciIGxvYWRpbmc9ImxhenkiPg0KICAgICAgICAgICAgICAgIDwvZGl2Pg0KDQogICAgICAgICAgICAgICAgPCEtLSBSaWdodDogT2ZmaWNpYWwgRXh0cmFjdGVkIFN0b3J5IFRleHQgLS0+DQogICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0iaGItYWJvdXQtdGV4dC1jb2wiPg0KICAgICAgICAgICAgICAgICAgICA8P3BocCANCiAgICAgICAgICAgICAgICAgICAgJHN0b3J5X3RpdGxlID0gbmVzcG9ydHNfc2V0dGluZygnYWJvdXRfc3RvcnlfdGl0bGUnLCAnJyk7DQogICAgICAgICAgICAgICAgICAgIGlmICghZW1wdHkoJHN0b3J5X3RpdGxlKSk6ID8+DQogICAgICAgICAgICAgICAgICAgICAgICA8aDIgc3R5bGU9ImZvbnQtc2l6ZTogMjhweDsgZm9udC13ZWlnaHQ6IDcwMDsgY29sb3I6ICMxMTExMTE7IG1hcmdpbjogMCAwIDE2cHg7Ij48P3BocCBlY2hvIGVzY19odG1sKCRzdG9yeV90aXRsZSk7ID8+PC9oMj4NCiAgICAgICAgICAgICAgICAgICAgPD9waHAgZW5kaWY7ID8+DQoNCiAgICAgICAgICAgICAgICAgICAgPD9waHAgDQogICAgICAgICAgICAgICAgICAgICRkZWZhdWx0X3N0b3J5ID0gIkF0IE5FIFNwb3J0czMsIHdlIGJlbGlldmUgc3BvcnRzIGFuZCBmaXRuZXNzIGFyZSBtb3JlIHRoYW4ganVzdCBhY3Rpdml0aWVzIOKAkyB0aGV5IGFyZSBhIGxpZmVzdHlsZS4gT3VyIG1pc3Npb24gaXMgdG8gZW1wb3dlciBhdGhsZXRlcywgZml0bmVzcyBlbnRodXNpYXN0cywgYW5kIGV2ZXJ5ZGF5IGNoYW1waW9ucyB3aXRoIHRoZSBoaWdoZXN0LXF1YWxpdHkgc3BvcnRzIGFuZCBneW0gcHJvZHVjdHMgdGhhdCBpbnNwaXJlIHBlcmZvcm1hbmNlLCBzdHJlbmd0aCwgYW5kIGNvbmZpZGVuY2UuXG5cbkZyb20gZHVyYWJsZSBneW0gZXF1aXBtZW50IGFuZCB0cmFpbmluZyBhY2Nlc3NvcmllcyB0byBwcmVtaXVtIHNwb3J0cyBnZWFyLCB3ZSBjYXJlZnVsbHkgc2VsZWN0IGV2ZXJ5IHByb2R1Y3QgdG8gZW5zdXJlIGl0IG1lZXRzIHRoZSBuZWVkcyBvZiBib3RoIGJlZ2lubmVycyBhbmQgcHJvZmVzc2lvbmFscy4gV2hldGhlciB5b3XigJlyZSBidWlsZGluZyBzdHJlbmd0aCBpbiB0aGUgZ3ltLCB0cmFpbmluZyBmb3IgY29tcGV0aXRpb24sIG9yIHNpbXBseSBzdGF5aW5nIGFjdGl2ZSwgTkUgU3BvcnRzMyBpcyBoZXJlIHRvIHN1cHBvcnQgeW91ciBqb3VybmV5LlxuXG5XZSBhcmUgcGFzc2lvbmF0ZSBhYm91dCBoZWxwaW5nIG91ciBjb21tdW5pdHkgc3RheSBmaXQsIGhlYWx0aHksIGFuZCBtb3RpdmF0ZWQuIFRoYXTigJlzIHdoeSB3ZSBjb21iaW5lIHRvcC1ub3RjaCBwcm9kdWN0cywgYWZmb3JkYWJsZSBwcmljZXMsIGFuZCByZWxpYWJsZSBzZXJ2aWNlIOKAkyBiZWNhdXNlIHlvdXIgZ29hbHMgbWF0dGVyIHRvIHVzLlxuXG5BdCBORSBTcG9ydHMzLCBpdOKAmXMgbm90IGp1c3QgYWJvdXQgcHJvZHVjdHMsIGl04oCZcyBhYm91dCBwcm9ncmVzcy4gTGV0IHVzIGJlIHlvdXIgdHJ1c3RlZCBwYXJ0bmVyIGluIGFjaGlldmluZyB5b3VyIGZpdG5lc3MgYW5kIHNwb3J0cyBhbWJpdGlvbnMuIjsNCiAgICAgICAgICAgICAgICAgICAgJHN0b3J5X3RleHQgPSBuZXNwb3J0c19zZXR0aW5nKCdhYm91dF9zdG9yeV90ZXh0JywgbmVzcG9ydHNfc2V0dGluZygnYWJvdXRfc3RvcnlfZGVzYycsICRkZWZhdWx0X3N0b3J5KSk7DQogICAgICAgICAgICAgICAgICAgICRwYXJhcyA9IGV4cGxvZGUoIlxuXG4iLCBzdHJfcmVwbGFjZSgiXHJcbiIsICJcbiIsICRzdG9yeV90ZXh0KSk7DQogICAgICAgICAgICAgICAgICAgIGZvcmVhY2ggKCRwYXJhcyBhcyAkcCk6DQogICAgICAgICAgICAgICAgICAgICAgICBpZiAodHJpbSgkcCkgIT09ICcnKToNCiAgICAgICAgICAgICAgICAgICAgPz4NCiAgICAgICAgICAgICAgICAgICAgICAgIDxwPjw/cGhwIGVjaG8gd3Bfa3Nlc19wb3N0KG5sMmJyKHRyaW0oJHApKSk7ID8+PC9wPg0KICAgICAgICAgICAgICAgICAgICA8P3BocCANCiAgICAgICAgICAgICAgICAgICAgICAgIGVuZGlmOw0KICAgICAgICAgICAgICAgICAgICBlbmRmb3JlYWNoOyANCiAgICAgICAgICAgICAgICAgICAgPz4NCg0KICAgICAgICAgICAgICAgICAgICA8P3BocCANCiAgICAgICAgICAgICAgICAgICAgJG1vdHRvID0gbmVzcG9ydHNfc2V0dGluZygnYWJvdXRfbW90dG8nLCAnVHJhaW4gaGFyZGVyLiBQbGF5IHN0cm9uZ2VyLiBMaXZlIGJldHRlciDigJMgd2l0aCBORSBTcG9ydHMzLicpOw0KICAgICAgICAgICAgICAgICAgICBpZiAoIWVtcHR5KCRtb3R0bykpOiA/Pg0KICAgICAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3M9ImhiLWFib3V0LW1vdHRvIj48P3BocCBlY2hvIGVzY19odG1sKCRtb3R0byk7ID8+PC9wPg0KICAgICAgICAgICAgICAgICAgICA8P3BocCBlbmRpZjsgPz4NCiAgICAgICAgICAgICAgICA8L2Rpdj4NCiAgICAgICAgICAgIDwvZGl2Pg0KICAgICAgICA8L2Rpdj4NCiAgICA8L3NlY3Rpb24+DQo8L21haW4+DQo8P3BocCBlbmRpZjsgPz4NCg0KPHN0eWxlPg0KLmhiLWFib3V0LXBhZ2Ugew0KICAgIGJhY2tncm91bmQ6ICNmZmZmZmY7DQogICAgbWluLWhlaWdodDogNzB2aDsNCn0NCg0KLmhiLWFib3V0LWhlcm8tYmFubmVyIHsNCiAgICBiYWNrZ3JvdW5kOiAjMDAwMDAwOw0KICAgIGNvbG9yOiAjZmZmZmZmOw0KICAgIHBhZGRpbmc6IDU2cHggMjBweDsNCiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7DQp9DQoNCi5oYi1hYm91dC1iYW5uZXItdGl0bGUgew0KICAgIGZvbnQtc2l6ZTogY2xhbXAoMzJweCwgNHZ3LCA0OHB4KTsNCiAgICBmb250LXdlaWdodDogNDAwOw0KICAgIGNvbG9yOiAjZmZmZmZmOw0KICAgIG1hcmdpbjogMDsNCiAgICBmb250LWZhbWlseTogdmFyKC0taGItZm9udCk7DQogICAgbGV0dGVyLXNwYWNpbmc6IC0wLjAxZW07DQp9DQoNCi5oYi1hYm91dC1jb250ZW50LXNlY3Rpb24gew0KICAgIHBhZGRpbmc6IDcwcHggMjRweCAxMDBweDsNCn0NCg0KLmhiLWFib3V0LWNvbnRhaW5lciB7DQogICAgbWF4LXdpZHRoOiAxMTYwcHg7DQogICAgbWFyZ2luOiAwIGF1dG87DQp9DQoNCi5oYi1hYm91dC10d28tY29sIHsNCiAgICBkaXNwbGF5OiBncmlkOw0KICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDEuMTVmcjsNCiAgICBnYXA6IDU2cHg7DQogICAgYWxpZ24taXRlbXM6IGNlbnRlcjsNCn0NCg0KLmhiLWFib3V0LW1lZGlhLWNvbCB7DQogICAgcG9zaXRpb246IHJlbGF0aXZlOw0KfQ0KDQouaGItYWJvdXQtZmVhdHVyZS1pbWcgew0KICAgIHdpZHRoOiAxMDAlOw0KICAgIGhlaWdodDogYXV0bzsNCiAgICBkaXNwbGF5OiBibG9jazsNCiAgICBib3JkZXItcmFkaXVzOiA4cHg7DQogICAgb2JqZWN0LWZpdDogY292ZXI7DQogICAgYm94LXNoYWRvdzogMCAxMHB4IDMwcHggcmdiYSgwLCAwLCAwLCAwLjA4KTsNCn0NCg0KLmhiLWFib3V0LXRleHQtY29sIHsNCiAgICBkaXNwbGF5OiBmbGV4Ow0KICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47DQogICAgZ2FwOiAxOHB4Ow0KICAgIGZvbnQtc2l6ZTogMTUuNXB4Ow0KICAgIGxpbmUtaGVpZ2h0OiAxLjc1Ow0KICAgIGNvbG9yOiAjMzc0MTUxOw0KICAgIGZvbnQtZmFtaWx5OiB2YXIoLS1oYi1mb250KTsNCn0NCg0KLmhiLWFib3V0LXRleHQtY29sIHAgew0KICAgIG1hcmdpbjogMDsNCn0NCg0KLmhiLWFib3V0LXRleHQtY29sIHN0cm9uZyB7DQogICAgY29sb3I6ICMxMTE4Mjc7DQogICAgZm9udC13ZWlnaHQ6IDQwMDsNCn0NCg0KLmhiLWFib3V0LW1vdHRvIHsNCiAgICBmb250LXNpemU6IDE2LjVweDsNCiAgICBjb2xvcjogIzExMTgyNzsNCiAgICBwYWRkaW5nLXRvcDogOHB4Ow0KfQ0KDQpAbWVkaWEgKG1heC13aWR0aDogOTAwcHgpIHsNCiAgICAuaGItYWJvdXQtdHdvLWNvbCB7DQogICAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyOw0KICAgICAgICBnYXA6IDQwcHg7DQogICAgfQ0KICAgIC5oYi1hYm91dC1jb250ZW50LXNlY3Rpb24gew0KICAgICAgICBwYWRkaW5nOiA1MHB4IDIwcHggNzBweDsNCiAgICB9DQogICAgLmhiLWFib3V0LWhlcm8tYmFubmVyIHsNCiAgICAgICAgcGFkZGluZzogNDRweCAyMHB4Ow0KICAgIH0NCn0NCjwvc3R5bGU+DQoNCjw/cGhwIGluY2x1ZGUgTkVTUE9SVFNfUExVR0lOX0RJUiAuICd0ZW1wbGF0ZXMvZm9vdGVyLW5lc3BvcnRzLnBocCc7ID8+DQo='),
);
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
    if (class_exists('\Elementor\Plugin')) {
        \Elementor\Plugin::$instance->files_manager->clear_cache();
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
        echo "=== POST 30090 ===
";
        echo "title: " . ($p30090 ? $p30090->post_title : 'none') . "
";
        echo "status: " . ($p30090 ? $p30090->post_status : 'none') . "
";
        echo "content_len: " . ($p30090 ? strlen($p30090->post_content) : 0) . "
";
        echo "elementor_edit_mode: " . get_post_meta(30090, '_elementor_edit_mode', true) . "
";
        $d30090 = get_post_meta(30090, '_elementor_data', true);
        echo "elementor_data_len: " . strlen($d30090) . "
";
        echo "elementor_data_snippet: " . substr($d30090, 0, 300) . "
";
        if (class_exists('\Elementor\Plugin')) {
            $doc = \Elementor\Plugin::$instance->documents->get(30090);
            echo "doc_exists: " . ($doc ? 'yes' : 'no') . "
";
            if ($doc) {
                echo "doc_is_built: " . ($doc->is_built_with_elementor() ? 'yes' : 'no') . "
";
            }
            $disp = \Elementor\Plugin::$instance->frontend->get_builder_content_for_display(30090);
            echo "get_builder_content_for_display_len: " . strlen($disp) . "
";
            $raw = \Elementor\Plugin::$instance->frontend->get_builder_content(30090);
            echo "get_builder_content_len: " . strlen($raw) . "
";
        }
        echo "
=== POST 4400 ===
";
        echo "title: " . ($p4400 ? $p4400->post_title : 'none') . "
";
        echo "status: " . ($p4400 ? $p4400->post_status : 'none') . "
";
        echo "content_len: " . ($p4400 ? strlen($p4400->post_content) : 0) . "
";
        echo "elementor_edit_mode: " . get_post_meta(4400, '_elementor_edit_mode', true) . "
";
        $d4400 = get_post_meta(4400, '_elementor_data', true);
        echo "elementor_data_len: " . strlen($d4400) . "
";
        echo "elementor_data_snippet: " . substr($d4400, 0, 300) . "
";
        if (class_exists('\Elementor\Plugin')) {
            $disp4 = \Elementor\Plugin::$instance->frontend->get_builder_content_for_display(4400);
            echo "4400_display_len: " . strlen($disp4) . "
";
            $raw4 = \Elementor\Plugin::$instance->frontend->get_builder_content(4400);
            echo "4400_raw_len: " . strlen($raw4) . "
";
        }
        exit;
    }
    run_nesports_v67_sync();
}, 1);
register_activation_hook(__FILE__, 'run_nesports_v67_sync');
