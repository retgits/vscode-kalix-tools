/**
 * generateInstaller runs the vsce package command and creates a zipfile with the installer
 * and the README
 * 
 * You can run this file with:
 * `npm run gen:installer`
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

shelljs.exec('vsce package', opts);
shelljs.exec(`zip vscode-akkasls-tools-${version}.zip vscode-akkasls-tools-${version}.vsix README.md`, opts);
