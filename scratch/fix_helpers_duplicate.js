const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'nesports-pro-store', 'includes', 'helpers.php');
let content = fs.readFileSync(file, 'utf8');

const duplicate = `    static $cached_catalog = null;
    if ($cached_catalog !== null) {
        return $cached_catalog;
    }`;

// Notice in lines 126-139:
const targetBlock = `function nesports_catalog() {
    static $cached_catalog = null;
    if ($cached_catalog !== null) {
        return $cached_catalog;
    }
    $managed = get_option('nesports_managed_catalog', null);
    if (is_array($managed) && !empty($managed)) {
        $cached_catalog = $managed;
        return $cached_catalog;
    }
    static $cached_catalog = null;
    if ($cached_catalog !== null) {
        return $cached_catalog;
    }`;

const cleanBlock = `function nesports_catalog() {
    static $cached_catalog = null;
    if ($cached_catalog !== null) {
        return $cached_catalog;
    }
    $managed = get_option('nesports_managed_catalog', null);
    if (is_array($managed) && !empty($managed)) {
        $cached_catalog = $managed;
        return $cached_catalog;
    }`;

if (content.includes(targetBlock)) {
    content = content.replace(targetBlock, cleanBlock);
    fs.writeFileSync(file, content, 'utf8');
    console.log("Fixed duplicate static variable declaration in helpers.php!");
} else {
    // Try normalized CRLF/LF
    content = content.replace(/\r\n/g, '\n');
    const tb = targetBlock.replace(/\r\n/g, '\n');
    const cb = cleanBlock.replace(/\r\n/g, '\n');
    if (content.includes(tb)) {
        content = content.replace(tb, cb);
        fs.writeFileSync(file, content, 'utf8');
        console.log("Fixed duplicate static variable declaration in helpers.php (normalized)!");
    } else {
        console.log("targetBlock not found in helpers.php");
    }
}
