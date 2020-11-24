'use strict'

import * as vscode from 'vscode';

import * as status from './statusTreeItem'

export class StatusExplorer implements vscode.TreeDataProvider<status.StatusTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<status.StatusTreeItem | undefined | void> = new vscode.EventEmitter<status.StatusTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<status.StatusTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: status.StatusTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<status.StatusTreeItem[]> {
        return Promise.resolve(status.getServiceStatus());
    }
}

export async function openStatusPage() {
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse('https://status.cloudstate.com/'));
}