// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Internal dependencies
import { addInvite, deleteInvite } from '../cli/roles';
import { getCurrentCommandConfig } from '../cli/commands';
import { logger } from '../../logger';
import { ShellResult } from '../../shell';
import { InviteNode, ProjectNode } from './projectexplorer';

export async function sendInvitation(p: ProjectNode): Promise<ShellResult | undefined> {
    const email = await vscode.window.showInputBox({
        prompt: 'The email address of the user to invite',
        ignoreFocusOut: true,
        password: false,
        placeHolder: 'example@example.com'
    });

    if (email === undefined) {
        return undefined;
    }

    try {
        const result = await addInvite(p.parentProjectID, email, getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}

export async function deleteInvitation(i: InviteNode): Promise<ShellResult | undefined> {
    try {
        const result = await deleteInvite(i.parentProjectID, i.invite.email, getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}