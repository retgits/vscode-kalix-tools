'use strict';

import * as sls from '../../akkasls';
import * as base from './credentialsBaseTreeItem';
import * as token from './tokenTreeItem';
import * as vscode from 'vscode';

export class CredentialsExplorer implements vscode.TreeDataProvider<base.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<base.TreeItem | undefined | void> = new vscode.EventEmitter<base.TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<base.TreeItem | undefined | void> = this._onDidChangeTreeData.event;
    private akkaServerless: sls.AkkaServerless;

    constructor(akkaServerless: sls.AkkaServerless) {
        this.akkaServerless = akkaServerless;
        this.akkaServerless.registerCredentialsExplorer(this);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: base.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: base.TreeItem): Thenable<base.TreeItem[]> {
        if (element) {
            switch (element.type) {
                case token.ITEM_TYPE:
                    return Promise.resolve(token.getTokenTreeItems(this.akkaServerless));
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(this.getDefaultCredentialItems());
    }

    getDefaultCredentialItems(): Promise<base.TreeItem[]> {
        let defaultTreeItems: base.TreeItem[] = [];
        defaultTreeItems.push(token.getDefaultTokenTreeItem());
        return Promise.resolve(defaultTreeItems);
    }

    async printTreeItemDetails(base: base.TreeItem) {
        base.printDetails();
    }

    async revokeCredential(token: token.TokenTreeItem) {
        this.akkaServerless.revokeToken(token.id);
    }
}