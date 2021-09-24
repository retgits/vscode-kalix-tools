/*global Thenable*/
import * as vscode from 'vscode';
import { StatusNode, getServiceStatus } from './statusnode';
import { openBrowser } from '../../utils/browser';
import { URLS } from '../../utils/constants';

/**
 * The StatusExplorer represents a tree of status items that can be shown and interacted with
 *
 * @class StatusExplorer
 * @implements {vscode.TreeDataProvider<ToolNode>}
 */
export class StatusExplorer implements vscode.TreeDataProvider<StatusNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<StatusNode | undefined | void> = new vscode.EventEmitter<StatusNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<StatusNode | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: StatusNode): StatusNode {
        return element;
    }

    getChildren(): Thenable<StatusNode[]> {
        return Promise.resolve(getServiceStatus());
    }

    openStatusInfoPage(): void {
        openBrowser(URLS.statuspage);
    }
}