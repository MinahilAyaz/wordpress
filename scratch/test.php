<?php
define('ABSPATH', true);
require_once 'nesports-pro-store/includes/helpers.php';
$cat = nesports_catalog();
echo "Total Products: " . count($cat) . PHP_EOL;
foreach ($cat as $i => $p) {
    echo ($i+1) . ". " . $p['name'] . " [" . $p['cat'] . "] - €" . $p['price'] . " (img: " . $p['main'] . ")" . PHP_EOL;
}
