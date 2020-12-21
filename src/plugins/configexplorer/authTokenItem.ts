import { AkkaServerless } from '../../akkasls';
import { BaseConfigExplorerItem } from './baseConfigExplorerItem';
import { Token } from '@retgits/akkasls-nodewrapper';
import { TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { logger } from '../../utils/logger';
import * as table from 'cli-table3';

export const TOKEN_ITEM_TYPE = 'Tokens';

export class AuthTokenItem extends BaseConfigExplorerItem {
    private readonly _tokenElements: string[] = [];

    constructor(
        public readonly label: string,
        public readonly token: Token,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, TOKEN_ITEM_TYPE);
        this._tokenElements = this.token.name.split('/');
    }

    getName(): string {
        return this._tokenElements[this._tokenElements.length-1];
    }

    getType(): string {
        return this._tokenElements[this._tokenElements.length-2];
    }

    description = this.token.description;

    id = this.getName();

    iconPath = new ThemeIcon('link');

    contextValue = TOKEN_ITEM_TYPE;

    printDetails(): void {
        if (this.label !== TOKEN_ITEM_TYPE) {
            const printTable = new table({});
            printTable.push(['Name', this.getName()]);
            printTable.push(['Description', this.token.description]);
            printTable.push(['Created on', new Date(this.token.created_time.seconds * 1000).toLocaleDateString()]);
            printTable.push(['Type', this.getType()]);
            logger.log(printTable.toString());
        }
    }
}

export async function getAuthTokenItems(akkasls: AkkaServerless): Promise<AuthTokenItem[]> {
    const items: AuthTokenItem[] = [];

    const tokenList = await akkasls.listAuthTokens();

    for (const token of tokenList) {
        const nameElements = token.name.split('/');
        items.push(new AuthTokenItem(nameElements[nameElements.length-1], token, TreeItemCollapsibleState.None));
    }

    return items;
}

export function getDefaultAuthTokenItem(): AuthTokenItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new AuthTokenItem(TOKEN_ITEM_TYPE, { name: TOKEN_ITEM_TYPE, description: '', created_time: { seconds: 1}, scopes: [1] }, TreeItemCollapsibleState.Collapsed);
}