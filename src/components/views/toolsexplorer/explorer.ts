import { TreeDataProvider, TreeItem, Event, EventEmitter } from 'vscode';
import { Shell } from '../../../utils/shell/shell';
import { ToolTreeItem, getToolTreeItems, openToolPage } from './toolsTreeItem';

export class ToolsExplorer implements TreeDataProvider<ToolTreeItem> {
    private _onDidChangeTreeData: EventEmitter<ToolTreeItem | undefined | void> = new EventEmitter<ToolTreeItem | undefined | void>();
    readonly onDidChangeTreeData: Event<ToolTreeItem | undefined | void> = this._onDidChangeTreeData.event;
    private _shell: Shell;

    constructor(shell: Shell) { 
        this._shell = shell;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ToolTreeItem): TreeItem {
        return element;
    }

    getChildren(): Thenable<ToolTreeItem[]> {
        return Promise.resolve(getToolTreeItems(this._shell));
    }

    openTreeItemInBrowser(item: ToolTreeItem) {
        openToolPage(item.tool);
    }
}