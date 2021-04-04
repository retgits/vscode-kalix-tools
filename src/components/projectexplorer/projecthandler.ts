// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Internal dependencies
import { newProject } from '../cli/project';
import { getCurrentCommandConfig } from '../cli/commands';
import { logger } from '../../logger';
import { ShellResult } from '../../shell';

export async function createNewProject(): Promise<ShellResult | undefined> {
    const name = await vscode.window.showInputBox({
        prompt: 'Set a name for your project...',
        ignoreFocusOut: true,
        password: false,
    });

    if (name === undefined) {
        return undefined;
    }

    const description = await vscode.window.showInputBox({
        prompt: 'Add a description for your project...',
        ignoreFocusOut: true,
        password: false,
    });

    if (description === undefined) {
        return undefined;
    }

    try {
        const result = await newProject(name, description, getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}