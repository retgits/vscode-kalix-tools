/**
 * generateInstaller runs the vsce package command and creates a zipfile with the installer
 * and the README
 *
 * You can run this file with:
 * `npm run utils:installer`
 */

import * as shelljs from 'shelljs';

// Read the package
const extensionData = require('../package.json');
const version = extensionData.version;

const opts = {
    env: process.env,
    async: false,
    cwd: process.cwd()
};

shelljs.exec('vsce package', opts);
shelljs.exec(`zip vscode-akkasls-tools-${version}.zip vscode-akkasls-tools-${version}.vsix README.md`, opts);