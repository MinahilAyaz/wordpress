<?php
define('ABSPATH', true);
require_once 'nesports-pro-store/includes/helpers.php';
$cat = nesports_catalog();
$categories = nesports_categories();
echo "Total Products in Store: " . count($cat) . PHP_EOL . PHP_EOL;
foreach ($categories as $k => $label) {
    $matching = array_filter($cat, function($p) use ($k) { return $p['cat'] === $k; });
    echo $label . " (" . $k . "): " . count($matching) . " products" . PHP_EOL;
    foreach ($matching as $p) {
        echo "  - " . $p['name'] . " (€" . $p['price'] . ")" . PHP_EOL;
    }
    echo PHP_EOL;
}

