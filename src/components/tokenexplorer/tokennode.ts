import * as vscode from 'vscode';
import { getConfiguration } from '../../utils/config';
import { TOKEN_ITEM_TYPE } from '../../utils/constants';
import { Token, Convert } from '../akkasls/api';
import { table } from 'table';
import { logger } from '../../utils/logger';
import { listTokens } from '../akkasls/auth/listTokens';

/**
 * A TokenNode is a token used to authenticate external systems.
 *
 * @export
 * @class TokenNode
 * @extends {vscode.TreeItem}
 */
export class TokenNode extends vscode.TreeItem {
    readonly _tokenElements: string[] = [];

    constructor(
        public readonly label: string,
        public readonly token: Token,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
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

    tooltip = this.token.description;

    contextValue = TOKEN_ITEM_TYPE;

    print(): void {
        const printTable = [];
        printTable.push(['Name', this.getName()]);
        printTable.push(['Description', this.token.description]);
        printTable.push(['Created on', new Date(this.token.created_time.seconds * 1000).toLocaleDateString()]);
        printTable.push(['Type', this.getType()]);
        logger.log(table(printTable), `Authentication Token details for: ${this.getName()}`);
    }
}

/**
 * The getTokens command returns all authentication tokens for the current logged in user.
 *
 * @return {*}  {(Promise<TokenNode[]>)}
 */
export async function getTokens(): Promise<TokenNode[]> {
    const result = await listTokens(getConfiguration());

    const items: TokenNode[] = [];

    if (result.code !== undefined) {
        vscode.window.showErrorMessage(`Unable to obtain auth tokens: ${result.stderr}`);
        return items;
    }

    const tokenList = Convert.toTokenList(result.stdout!);

    for (const token of tokenList) {
        const nameElements = token.name.split('/');
        items.push(new TokenNode(nameElements[nameElements.length - 1], token, vscode.TreeItemCollapsibleState.None));
    }

    return items;
}