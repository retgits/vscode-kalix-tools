// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Internal dependencies
import { revokeAuthToken, createAuthToken } from '../cli/auth';
import { getCurrentCommandConfig } from '../cli/commands';
import { logger } from '../../logger';
import { AuthTokenNode } from './accountexplorer';
import { ShellResult } from '../../shell';

/**
 * The revokeAuthTokenNode revokes an authentication token
 *
 * @export
 * @param {AuthTokenNode} tkn The auth token to revoke
 */
export async function revokeAuthTokenNode(tkn: AuthTokenNode): Promise<ShellResult | undefined> {
    try {
        const result = await revokeAuthToken(tkn._tokenElements[tkn._tokenElements.length - 1], getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}

/**
 * The createAuthTokenNode command allows you to create a refresh token that can be
 * used to authenticate another akkasls command instance on another machine
 *
 * @export
 * @return {*}  {(Promise<ShellResult | undefined>)}
 */
export async function createAuthTokenNode(): Promise<ShellResult | undefined> {
    const tokenType = await vscode.window.showQuickPick(['refresh', 'access'], {
		canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: 'Select token type'
	});

    if (tokenType === undefined) {
        return undefined;
    }

    const tokenScope = await vscode.window.showQuickPick(['execution', 'all'], {
		canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: 'Select token scope'
	});

    if (tokenScope === undefined) {
        return undefined;
    }

    const description = await vscode.window.showInputBox({
        prompt: 'Add a description for your auth token...',
        ignoreFocusOut: true,
        password: false,
    });

    if (description === undefined) {
        return undefined;
    }

    try {
        const result = await createAuthToken(tokenType, tokenScope, description, getCurrentCommandConfig());
        logger.log(result!.stdout);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}