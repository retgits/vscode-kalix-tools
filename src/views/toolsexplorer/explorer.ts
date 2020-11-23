'use strict'

import * as vscode from 'vscode';
import * as tool from './toolsTreeItem'

export class TreeDataProvider implements vscode.TreeDataProvider<tool.ToolTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<tool.ToolTreeItem | undefined | void> = new vscode.EventEmitter<tool.ToolTreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<tool.ToolTreeItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor() { }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: tool.ToolTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<tool.ToolTreeItem[]> {
        return Promise.resolve(tool.Get());
    }
}