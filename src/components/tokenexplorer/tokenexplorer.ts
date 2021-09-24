/*global Thenable*/
import * as vscode from 'vscode';
import { TokenNode, getTokens } from './tokennode';

/**
 * The TokenExplorer represents a tree of token items that can be shown and interacted with
 *
 * @class TokenExplorer
 * @implements {vscode.TreeDataProvider<ToolNode>}
 */
export class TokenExplorer implements vscode.TreeDataProvider<TokenNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<TokenNode | undefined | void> = new vscode.EventEmitter<TokenNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<TokenNode | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: TokenNode): TokenNode {
        return element;
    }

    getChildren(): Thenable<TokenNode[]> {
        return Promise.resolve(getTokens());
    }
}