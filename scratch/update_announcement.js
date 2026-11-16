const fs = require('fs');
const headerPath = 'nesports-pro-store/templates/header-nesports.php';
let headerContent = fs.readFileSync(headerPath, 'utf8');

headerContent = headerContent.replace(
  /\$announcement\s*=\s*!empty\(\$settings\['announcement_text'\]\)[\s\S]*?;/,
  "$announcement = 'Free shipping on All DE orders over 150€';"
);
fs.writeFileSync(headerPath, headerContent, 'utf8');
console.log('header-nesports.php updated!');

const actPath = 'nesports-pro-store/includes/class-nesports-activator.php';
if (fs.existsSync(actPath)) {
  let actContent = fs.readFileSync(actPath, 'utf8');
  actContent = actContent.replace(
    /'announcement_text'\s*=>\s*'[^']*'/,
    "'announcement_text' => 'Free shipping on All DE orders over 150€'"
  );
  fs.writeFileSync(actPath, actContent, 'utf8');
  console.log('class-nesports-activator.php updated!');
}
