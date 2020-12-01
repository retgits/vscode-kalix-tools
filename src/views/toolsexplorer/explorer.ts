'use strict';

import { TreeDataProvider, TreeItem, Event, EventEmitter } from 'vscode';
import { ToolTreeItem, GetToolTreeItems, OpenToolPage } from './toolsTreeItem';

export class ToolsExplorer implements TreeDataProvider<ToolTreeItem> {
    private _onDidChangeTreeData: EventEmitter<ToolTreeItem | undefined | void> = new EventEmitter<ToolTreeItem | undefined | void>();
    readonly onDidChangeTreeData: Event<ToolTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ToolTreeItem): TreeItem {
        return element;
    }

    getChildren(): Thenable<ToolTreeItem[]> {
        return Promise.resolve(GetToolTreeItems());
    }

    openTreeItemInBrowser(item: ToolTreeItem) {
        OpenToolPage(item.tool);
    }
}