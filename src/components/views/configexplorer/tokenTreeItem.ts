import { AkkaServerless } from '../../../akkasls';
import { ConfigBaseTreeItem } from './configBaseTreeItem';
import { Token } from '../../../akkasls/datatypes/auth/tokens';
import { TreeItemCollapsibleState, ThemeIcon } from 'vscode';
import { aslogger } from '../../../utils/logger';
import * as table from 'cli-table3';

export const TOKEN_ITEM_TYPE = 'Tokens';

export class TokenTreeItem extends ConfigBaseTreeItem {
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

    getIcon(): ThemeIcon {
        return new ThemeIcon('link');
    }

    id = this.getName();

    iconPath = this.getIcon();

    contextValue = TOKEN_ITEM_TYPE;

    printDetails() {
        if (this.label !== TOKEN_ITEM_TYPE) {
            let printTable = new table({});
            printTable.push(['Name', this.getName()]);
            printTable.push(['Description', this.token.description]);
            printTable.push(['Created on', new Date(this.token.created_time.seconds * 1000).toLocaleDateString()]);
            printTable.push(['Type', this.getType()]);
            aslogger.log(printTable.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
        }
    }
}

export async function getTokenTreeItems(akkasls: AkkaServerless): Promise<TokenTreeItem[]> {
    let items: TokenTreeItem[] = [];

    let tokenList = await akkasls.listAuthTokens();

    for (let token of tokenList) {
        let nameElements = token.name.split('/');
        items.push(new TokenTreeItem(nameElements[nameElements.length-1], token, TreeItemCollapsibleState.None));
    }

    return items;
}

export function getDefaultTokenTreeItem(): TokenTreeItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new TokenTreeItem(TOKEN_ITEM_TYPE, { name: TOKEN_ITEM_TYPE, description: '', created_time: { seconds: 1}, scopes: [1] }, TreeItemCollapsibleState.Collapsed);
}