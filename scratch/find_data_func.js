const fs = require('fs');

const findInDir = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const full = dir + '/' + file;
        if (fs.statSync(full).isDirectory()) {
            findInDir(full);
        } else if (file.endsWith('.php')) {
            const content = fs.readFileSync(full, 'utf8');
            if (content.includes('function nesports_collections') || content.includes('function nesports_clothing')) {
                console.log('Found in:', full);
            }
        }
    });
};

findInDir('nesports-pro-store');
