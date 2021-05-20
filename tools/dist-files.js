const fs = require('fs');
const path = require('path');
const packageInfo = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json')).toString());


packageInfo.main = './lib/index.js';
fs.writeFileSync(path.resolve(process.cwd(), './dist/package.json'), JSON.stringify(packageInfo, null, 2));

let files = fs.readdirSync(process.cwd()),
    ignored = fs.readFileSync(path.resolve(process.cwd(), '.npmignore')).toString().split('\n');

for (let fileName of files) {
    if (!ignored.includes(fileName) && fileName !== 'package.json') {
        fs.copyFileSync(fileName, `./dist/${fileName}`);
    }
}
