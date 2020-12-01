'use strict';

import { TreeDataProvider, EventEmitter, Event, commands, Uri } from 'vscode';
import { StatusTreeItem, GetServiceStatus } from './statusTreeItem';

export class StatusExplorer implements TreeDataProvider<StatusTreeItem> {
    private _onDidChangeTreeData: EventEmitter<StatusTreeItem | undefined | void> = new EventEmitter<StatusTreeItem | undefined | void>();
    readonly onDidChangeTreeData: Event<StatusTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: StatusTreeItem): StatusTreeItem {
        return element;
    }

    getChildren(): Thenable<StatusTreeItem[]> {
        return Promise.resolve(GetServiceStatus());
    }

    openTreeItemInBrowser() {
        commands.executeCommand('vscode.open', Uri.parse('https://status.cloudstate.com/'));
    }
}