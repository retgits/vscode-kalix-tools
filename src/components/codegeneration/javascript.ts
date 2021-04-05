// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { isExperimentalEnabled } from '../../experimental';
import { getCurrentCommandConfig } from '../cli/commands';
import { logger } from '../../logger';
import { dirSync } from 'tmp';
import * as path from 'path';

// Internal dependencies
import { generateNpmJs, generateNpxJs } from '../cli/entities';
import { shell } from '../../shell';

export async function npm() {
    if (!isExperimentalEnabled()) {
        vscode.window.showErrorMessage('In order to use this feature, you\'ll need to enable the experimental features flag');
        return;
    }

    const name = await vscode.window.showInputBox({
        prompt: 'The name of your new service',
        ignoreFocusOut: true,
        password: false,
    });

    if (name === undefined) {
        return;
    }

    const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Select',
        canSelectFiles: false,
        canSelectFolders: true,
        title: 'Select folder to save project to'
    };

    const folder = await vscode.window.showOpenDialog(options);

    if (folder === undefined) {
        return;
    }

    const tempFolder = dirSync();
    const outputFile = path.join(tempFolder.name, name);

    try {
        const result = await generateNpmJs(outputFile, name, getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        if (shell.isUnix()) {
            await shell.exec(`unzip ${outputFile} -d ${folder[0].fsPath}`);
        }
        if (shell.isWindows()) {
            await shell.exec(`powershell Expand-Archive -Path ${outputFile} -DestinationPath ${folder[0].fsPath}`);
        }
        tempFolder.removeCallback();
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return;
    }
}

export async function npx() {
    if (!isExperimentalEnabled()) {
        vscode.window.showErrorMessage('In order to use this feature, you\'ll need to enable the experimental features flag');
        return;
    }

    const name = await vscode.window.showInputBox({
        prompt: 'The name of your new service',
        ignoreFocusOut: true,
        password: false,
    });

    if (name === undefined) {
        return;
    }

    const options: vscode.OpenDialogOptions = {
        canSelectMany: false,
        openLabel: 'Select',
        canSelectFiles: false,
        canSelectFolders: true,
        title: 'Select folder to save project to'
    };

    const folder = await vscode.window.showOpenDialog(options);

    if (folder === undefined) {
        return;
    }

    try {
        const result = await generateNpxJs(name, folder[0].fsPath, getCurrentCommandConfig());
        if (result?.code === 0) {
            logger.log(`Your new project is ready in ${ path.join(folder[0].fsPath, name)}`);
        }
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return;
    }
}