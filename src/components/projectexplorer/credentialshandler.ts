// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Internal dependencies
import { addDockerCredentials, deleteDockerCredentials } from '../cli/docker';
import { getCurrentCommandConfig } from '../cli/commands';
import { logger } from '../../logger';
import { ShellResult } from '../../shell';
import { ProjectNode, ContainerRegistryCredentialNode } from './projectexplorer';

export async function addRegistryCredentials(p: ProjectNode): Promise<ShellResult | undefined> {
    const creds = await vscode.window.showInputBox({
        prompt: 'The credential string for the container registry',
        ignoreFocusOut: true,
        password: false,
        placeHolder: '--docker-email <> --docker-password <> --docker-server <> --docker-username <>'
    });

    if (creds === undefined) {
        return undefined;
    }

    try {
        const result = await addDockerCredentials(p.parentProjectID, creds, getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}

export async function deleteRegistryCredentials(c: ContainerRegistryCredentialNode): Promise<ShellResult | undefined> {
    try {
        const result = await deleteDockerCredentials(c.parentProjectID, c.id, getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}