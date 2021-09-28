import { getConfiguration } from '../../utils/config';
import { logger } from '../../utils/logger';
import { createToken } from '../akkasls/auth/createToken';
import { revokeToken } from '../akkasls/auth/revokeToken';
import { ShellResult } from '../shell/shell';
import { showInputBox } from '../wizard/inputBox';
import { showSingleQuickPick } from '../wizard/quickPick';
import { TokenExplorer } from './tokenexplorer';
import { TokenNode } from './tokennode';

export async function handleRevokeAuthToken(item: TokenNode, tree: TokenExplorer) {
    const res = await revokeAuthToken(item);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

export async function handleAddAuthToken(tree: TokenExplorer) {
    const res = await addAuthToken();
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

/**
 * revokeAuthToken revokes an authentication token
 *
 * @export
 * @param {TokenNode} tkn
 * @return {*}  {Promise<ShellResult>}
 */
async function revokeAuthToken(tkn: TokenNode): Promise<ShellResult> {
    let result: ShellResult;
    try {
        result = await revokeToken(tkn._tokenElements[tkn._tokenElements.length - 1], getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: '-1',
            stderr: ex
        };
    }
    return result;
}

/**
 * addAuthToken creates a new authentication token
 *
 * @export
 * @return {*}  {Promise<ShellResult>}
 */
async function addAuthToken(): Promise<ShellResult> {
    const tokenType = await showSingleQuickPick({
        title: 'Create a new authentication token (Step 1/3)',
        items: ['refresh', 'access'],
        placeHolder: 'Select token type'
    });

    if (tokenType === undefined) {
        return { code: '-1', stderr: 'no token type provided' };
    }

    const tokenScope = await showSingleQuickPick({
        title: 'Create a new authentication token (Step 2/3)',
        items: ['all', 'projects', 'user'],
        placeHolder: 'Select token scope'
    });

    if (tokenScope === undefined) {
        return { code: '-1', stderr: 'no token scope provided' };
    }

    const tokenDescription = await showInputBox({
        title: 'Create a new authentication token (Step 3/3)',
        placeHolder: 'Add a description for your auth token...'
    });

    if (tokenDescription === undefined) {
        return { code: '-1', stderr: 'no token description provided' };
    }

    let result: ShellResult;
    
    try {
        result = await createToken(tokenType, tokenScope, tokenDescription, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: '-1',
            stderr: ex
        };
    }

    return result;
}