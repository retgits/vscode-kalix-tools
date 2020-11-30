/**
 * generateTag creates a tag in the GitHub repository with the latest version number
 * 
 * You can run this file with:
 * `npm run gen:tag`
 */

import * as shelljs from 'shelljs';

// Read the package
let extensionData = require('../package.json');
let version = extensionData.version;

let opts = { 
    env: process.env,
    async: false,
    cwd: process.cwd()
};

shelljs.exec(`git tag v${version}`, opts);
shelljs.exec(`git push origin v${version}`, opts);
