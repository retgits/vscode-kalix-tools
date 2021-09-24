import * as vscode from 'vscode';
import { getConfiguration } from '../../utils/config';
import { Convert } from '../akkasls/api';
import { currentLogin } from '../akkasls/auth/currentLogin';

/**
 * An AccountNode is a single item that is derived from the current user.
 *
 * @export
 * @class StatusNode
 * @extends {vscode.TreeItem}
 */
export class AccountNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly codicon: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }

    iconPath = new vscode.ThemeIcon(this.codicon);
    tooltip = this.description;
    print(): void { }
}

/**
 * The getCurrentUser function gets the details of the current logged in user
 *
 * @return {*}  {Promise<AccountNode[]>}
 */
export async function getCurrentUser(): Promise<AccountNode[]> {
    const account = await currentLogin(getConfiguration());

    const items: AccountNode[] = [];

    if (account.code !== undefined) {
        vscode.window.showErrorMessage(`Unable to obtain user information: ${account.stderr}`);
        return items;
    }

    const user = Convert.toCurrentLogin(account.stdout!);

    items.push(new AccountNode('user', user.user.fullName, 'account', vscode.TreeItemCollapsibleState.None));
    items.push(new AccountNode('email', user.user.email, 'mail', vscode.TreeItemCollapsibleState.None));
    items.push(new AccountNode('account', user.user.billing_identifier.billing_type, 'account', vscode.TreeItemCollapsibleState.None));
    return items;
}