'use strict';

import { AkkaServerless } from '../../akkasls';
import { CredentialsBaseTreeItem } from './credentialsBaseTreeItem';
import { TokenTreeItem, GetTokenTreeItems, TOKEN_ITEM_TYPE, GetDefaultTokenTreeItem } from './tokenTreeItem';
import { TreeDataProvider, EventEmitter, Event, TreeItem } from 'vscode';

export class CredentialsExplorer implements TreeDataProvider<CredentialsBaseTreeItem> {
    private _onDidChangeTreeData: EventEmitter<CredentialsBaseTreeItem | undefined | void> = new EventEmitter<CredentialsBaseTreeItem | undefined | void>();
    readonly onDidChangeTreeData: Event<CredentialsBaseTreeItem | undefined | void> = this._onDidChangeTreeData.event;
    private akkaServerless: AkkaServerless;

    constructor(akkaServerless: AkkaServerless) {
        this.akkaServerless = akkaServerless;
        this.akkaServerless.registerCredentialsExplorer(this);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CredentialsBaseTreeItem): TreeItem {
        return element;
    }

    getChildren(element?: CredentialsBaseTreeItem): Thenable<CredentialsBaseTreeItem[]> {
        if (element) {
            switch (element.type) {
                case TOKEN_ITEM_TYPE:
                    return Promise.resolve(GetTokenTreeItems(this.akkaServerless));
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(this.getDefaultCredentialItems());
    }

    getDefaultCredentialItems(): Promise<CredentialsBaseTreeItem[]> {
        let defaultTreeItems: CredentialsBaseTreeItem[] = [];
        defaultTreeItems.push(GetDefaultTokenTreeItem());
        return Promise.resolve(defaultTreeItems);
    }

    async printTreeItemDetails(base: CredentialsBaseTreeItem) {
        base.printDetails();
    }

    async revokeCredential(token: TokenTreeItem) {
        this.akkaServerless.revokeToken(token.id);
    }
}