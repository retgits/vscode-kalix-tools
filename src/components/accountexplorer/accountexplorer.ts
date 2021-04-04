// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// External dependencies
import * as table from 'cli-table3';

// Internal dependencies
import { currentLogin, CurrentLogin, Token, listAuthTokens } from '../cli/auth';
import { getCurrentCommandConfig } from '../cli/commands';
import { logger } from '../../logger';

// Constants
const ACCOUNT_ITEM_TYPE = 'Accounts';
const TOKEN_ITEM_TYPE = 'Tokens';

/**
 * The AccountNode is the default base class for any node in the account explorer
 *
 * @export
 * @class AccountNode
 * @extends {vscode.TreeItem}
 */
export abstract class AccountNode extends vscode.TreeItem {
    public readonly type: string;

    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, type: string) {
        super(label, collapsibleState);
        this.type = type;
    }

    abstract print(): void;
}

/**
 * An AuthTokenNode represents a single token used by Akka Serverless to authenticate
 * external systems.
 *
 * @class AuthTokenNode
 * @extends {AccountNode}
 */
export class AuthTokenNode extends AccountNode {
    readonly _tokenElements: string[] = [];

    constructor(
        public readonly label: string,
        public readonly token: Token,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, TOKEN_ITEM_TYPE);
        this._tokenElements = this.token.name.split('/');
    }

    getName(): string {
        return this._tokenElements[this._tokenElements.length - 1];
    }

    getType(): string {
        return this._tokenElements[this._tokenElements.length - 2];
    }

    description = this.token.description;

    id = this.getName();

    iconPath = new vscode.ThemeIcon('link');

    contextValue = TOKEN_ITEM_TYPE;

    print(): void {
        if (this.label !== TOKEN_ITEM_TYPE) {
            const printTable = new table({});
            printTable.push(['Name', this.getName()]);
            printTable.push(['Description', this.token.description]);
            printTable.push(['Created on', new Date(this.token.created_time.seconds * 1000).toLocaleDateString()]);
            printTable.push(['Type', this.getType()]);
            logger.log(printTable.toString(), `Authentication Token details for: ${this.getName()}`);
        }
    }
}

/**
 * The AccountExplorer is the tree that shows the current logged in user and handles all authentication tokens.
 *
 * @class AccountExplorer
 * @implements {vscode.TreeDataProvider<AccountNode>}
 */
export class AccountExplorer implements vscode.TreeDataProvider<AccountNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<AccountNode | undefined | void> = new vscode.EventEmitter<AccountNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<AccountNode | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: AccountNode): vscode.TreeItem {
        return element;
    }

    getChildren(element?: AccountNode): Thenable<AccountNode[] | undefined> {
        if (element) {
            switch (element.type) {
                case TOKEN_ITEM_TYPE:
                    return Promise.resolve(getAuthTokens());
                case ACCOUNT_ITEM_TYPE:
                    return Promise.resolve(userDetails());
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(this.getDefaultCredentialItems());
    }

    getDefaultCredentialItems(): Promise<AccountNode[]> {
        const defaultTreeItems: AccountNode[] = [];
        defaultTreeItems.push(getToplevelAuthTokenNode());
        defaultTreeItems.push(getToplevelAccountNode());
        return Promise.resolve(defaultTreeItems);
    }

    async print(base: AccountNode): Promise<void> {
        base.print();
    }
}

/**
 * The CurrentAccountNode represents an item of the account of the current logged in user
 * to Akka Serverless
 *
 * @class CurrentAccountNode
 * @extends {AccountNode}
 */
class CurrentAccountNode extends AccountNode {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly codicon: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, ACCOUNT_ITEM_TYPE);
    }

    iconPath = new vscode.ThemeIcon(this.codicon);
    tooltip = this.description;
    print(): void { };
}

/**
 * The userDetails command gets the details of the current logged in user.
 *
 * @return {*}  {(Promise<CurrentLoginNode[] | undefined>)}
 */
async function userDetails(): Promise<CurrentAccountNode[] | undefined> {
    const account = await currentLogin(getCurrentCommandConfig());

    if (account === undefined) {
        return undefined;
    }

    const user = account.response as CurrentLogin;

    const items: CurrentAccountNode[] = [];
    items.push(new CurrentAccountNode('user', user.user.fullName, 'account', vscode.TreeItemCollapsibleState.None));
    items.push(new CurrentAccountNode('email', user.user.email, 'mail', vscode.TreeItemCollapsibleState.None));
    items.push(new CurrentAccountNode('verified', `${user.user.email_verified}`, 'pass', vscode.TreeItemCollapsibleState.None));
    return items;
}

/**
 * The getToplevelAccountNode command gets the top level node for the current logged in user.
 *
 * @return {*}  {CurrentAccountNode}
 */
function getToplevelAccountNode(): CurrentAccountNode {
    return new CurrentAccountNode('Account', '', 'account', vscode.TreeItemCollapsibleState.Collapsed);
}

/**
 * The getAuthTokens command returns all authentication tokens for the current logged in
 * user.
 *
 * @return {*}  {(Promise<AuthTokenNode[] | undefined>)}
 */
async function getAuthTokens(): Promise<AuthTokenNode[] | undefined> {
    const items: AuthTokenNode[] = [];

    const result = await listAuthTokens(getCurrentCommandConfig());

    if (result === undefined) {
        return undefined;
    }

    const tokenList = result.response as Token[];

    for (const token of tokenList) {
        const nameElements = token.name.split('/');
        items.push(new AuthTokenNode(nameElements[nameElements.length - 1], token, vscode.TreeItemCollapsibleState.None));
    }

    return items;
}

/**
 * The getDefaultAuthTokenItem command gets the top level node for the authentication
 * tokens of the current logged in user.
 *
 * @return {*}  {AuthTokenNode}
 */
function getToplevelAuthTokenNode(): AuthTokenNode {
    // eslint-disable-next-line camelcase
    return new AuthTokenNode(TOKEN_ITEM_TYPE, { name: TOKEN_ITEM_TYPE, description: '', created_time: { seconds: 1 }, scopes: [1] }, vscode.TreeItemCollapsibleState.Collapsed);
}