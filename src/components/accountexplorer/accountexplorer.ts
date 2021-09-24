/*global Thenable*/
import * as vscode from 'vscode';
import { AccountNode, getCurrentUser } from './accountnode';

/**
 * The AccountExplorer represents a tree of Account items that can be shown and interacted with
 *
 * @class AccountExplorer
 * @implements {vscode.TreeDataProvider<ToolNode>}
 */
export class AccountExplorer implements vscode.TreeDataProvider<AccountNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<AccountNode | undefined | void> = new vscode.EventEmitter<AccountNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<AccountNode | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: AccountNode): AccountNode {
        return element;
    }

    getChildren(): Thenable<AccountNode[]> {
        return Promise.resolve(getCurrentUser());
    }
}