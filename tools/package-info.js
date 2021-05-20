const fs = require('fs');
const path = require('path');
const packageInfo = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json')).toString());
const property = process.argv.slice(2, 3)[0];


process.stdout.write(property.split('.').reduce((source, prop) => {
    return source[prop];
}, packageInfo));
