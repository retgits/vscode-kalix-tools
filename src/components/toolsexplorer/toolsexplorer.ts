/*global Thenable*/
import * as vscode from 'vscode';
import { ToolNode, getToolNodes } from './toolnode';
import { openBrowser } from '../../utils/browser';

/**
 * Tool is a command line tool that can be used by the Akka Serverless VS Code extension.
 */
export interface Tool {
    name: string;
    versionCmd: string;
    toolTip?: string;
    currentVersion?: string;
    infoURL?: string;
    updateURL?: string;
}

/**
 * The ToolExplorer represents a tree of tools that can be shown and interacted with
 *
 * @class ToolsExplorer
 * @implements {vscode.TreeDataProvider<ToolNode>}
 */
export class ToolsExplorer implements vscode.TreeDataProvider<ToolNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<ToolNode | undefined | void> = new vscode.EventEmitter<ToolNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<ToolNode | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ToolNode): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<ToolNode[]> {
        return Promise.resolve(getToolNodes());
    }

    openToolInfoPage(item: ToolNode): void {
        if (item.tool.infoURL) {
            openBrowser(item.tool.infoURL);
        }
    }
}