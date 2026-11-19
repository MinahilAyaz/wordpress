const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'nesports-pro-store', 'includes', 'helpers.php');
let content = fs.readFileSync(file, 'utf8');

const target = 'function nesports_catalog() {';
const replacement = `function nesports_get_managed_catalog() {
    $catalog = get_option('nesports_managed_catalog', null);
    if (!is_array($catalog) || empty($catalog)) {
        $catalog = nesports_preset_catalog();
        update_option('nesports_managed_catalog', $catalog);
    }
    return $catalog;
}

function nesports_catalog() {
    static $cached_catalog = null;
    if ($cached_catalog !== null) {
        return $cached_catalog;
    }
    $managed = get_option('nesports_managed_catalog', null);
    if (is_array($managed) && !empty($managed)) {
        $cached_catalog = $managed;
        return $cached_catalog;
    }`;

if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Successfully updated helpers.php!");
} else {
    console.log("Target string not found in helpers.php");
}
