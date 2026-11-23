<?php
/**
 * Plugin Name: NESports Core Patch 73
 * Version: 73.0
 */
if (!defined("ABSPATH")) exit;

add_action("init", function() {
    // Auto forward any attempt to edit obsolete post 4400 to the official active post 30090
    if (isset($_GET["post"]) && $_GET["post"] == 4400) {
        $action = isset($_GET["action"]) ? $_GET["action"] : "edit";
        wp_redirect(admin_url("post.php?post=30090&action=" . $action));
        exit;
    }
}, 1);
