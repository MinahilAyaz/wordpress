<?php
define('ABSPATH', dirname(__DIR__) . '/');
require_once dirname(__DIR__) . '/nesports-pro-store/includes/helpers.php';

$catalog = nesports_catalog();
echo "Testing all " . count($catalog) . " products...\n\n";

$failed = 0;
foreach ($catalog as $p) {
    putenv('NES_PAGE=product');
    putenv('NES_SLUG=' . $p['slug']);
    
    ob_start();
    include dirname(__DIR__) . '/preview/render.php';
    $html = ob_get_clean();

    $profile = nesports_product_profile($p);

    // Checks
    $hasForeignBelt = ($p['cat'] !== 'belts' && strpos($html, 'Steerhide Leather Lever Belt') !== false);
    $hasWrongThickness = (!$profile['has_thickness'] && strpos($html, 'Thickness:') !== false);
    $hasWaistSizesOnNonBelt = (!$profile['has_size_guide'] && strpos($html, 'Waist (Inches)') !== false);

    $status = 'OK';
    if ($hasForeignBelt || $hasWrongThickness || $hasWaistSizesOnNonBelt || strlen($html) < 2000) {
        $status = 'FAIL';
        $failed++;
    }

    echo sprintf(
        "[%s] %-45s | Cat: %-6s | Imgs: %d | Colors: %d | Thickness: %s | Size: %s\n",
        $status,
        $p['slug'],
        $p['cat'],
        count($profile['gallery']),
        count($profile['colors']),
        $profile['has_thickness'] ? 'YES' : 'NO',
        $profile['has_size'] ? $profile['sizes'][0]['label'] : 'NO'
    );
}

echo "\nResult: " . ($failed === 0 ? "ALL 16 PRODUCTS PASSED PERFECTLY!" : "$failed PRODUCTS FAILED") . "\n";
