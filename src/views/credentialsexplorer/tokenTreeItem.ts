'use strict';

import * as sls from '../../akkasls';
import { CredentialsBaseTreeItem } from './credentialsBaseTreeItem';
import * as token from '../../datatypes/auth/tokenlist';
import * as vscode from 'vscode';
import { aslogger } from '../../utils/logger';
import * as table from 'cli-table3';

export const TOKEN_ITEM_TYPE = 'Tokens';

export class TokenTreeItem extends CredentialsBaseTreeItem {
    private readonly tokenElements: string[] = [];

    constructor(
        public readonly label: string,
        public readonly token: token.TokenList,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, TOKEN_ITEM_TYPE);
        this.tokenElements = this.token.name.split('/');
    }

    getName(): string {
        return this.tokenElements[this.tokenElements.length-1];
    }

    getType(): string {
        return this.tokenElements[this.tokenElements.length-2];
    }

    description = this.token.description;

    getIcon(): vscode.ThemeIcon {
        return new vscode.ThemeIcon('link');
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

export async function GetTokenTreeItems(akkasls: sls.AkkaServerless): Promise<TokenTreeItem[]> {
    let items: TokenTreeItem[] = [];

    let tokenList = await akkasls.getTokens();

    for (let token of tokenList) {
        let nameElements = token.name.split('/');
        items.push(new TokenTreeItem(nameElements[nameElements.length-1], token, vscode.TreeItemCollapsibleState.None));
    }

    return items;
}

export function GetDefaultTokenTreeItem(): TokenTreeItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new TokenTreeItem(TOKEN_ITEM_TYPE, { name: TOKEN_ITEM_TYPE, description: '', created_time: { seconds: 1}, scopes: [1] }, vscode.TreeItemCollapsibleState.Collapsed);
}