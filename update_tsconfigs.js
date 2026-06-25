const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
            results = results.concat(walk(fullPath));
        } else if (file === 'tsconfig.json') {
            results.push(fullPath);
        }
    });
    return results;
}

const packagesDir = path.join(__dirname, 'packages');
const tsConfigFiles = walk(packagesDir);

tsConfigFiles.forEach(file => {
    try {
        const content = fs.readFileSync(file, 'utf8');
        const json = JSON.parse(content);
        if (json.compilerOptions && json.compilerOptions.composite !== true) {
            json.compilerOptions.composite = true;
            fs.writeFileSync(file, JSON.stringify(json, null, 2));
            console.log(`Updated ${file}`);
        }
    } catch (e) {
        console.error(`Error processing ${file}: ${e.message}`);
    }
});
