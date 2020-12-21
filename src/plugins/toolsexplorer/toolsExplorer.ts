import { TreeDataProvider, TreeItem, Event, EventEmitter } from 'vscode';
import { ToolsExplorerItem, getToolsExplorerItems, openToolPage } from './toolsExplorerItem';

export class ToolsExplorer implements TreeDataProvider<ToolsExplorerItem> {
    private _onDidChangeTreeData: EventEmitter<ToolsExplorerItem | undefined | void> = new EventEmitter<ToolsExplorerItem | undefined | void>();
    readonly onDidChangeTreeData: Event<ToolsExplorerItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ToolsExplorerItem): TreeItem {
        return element;
    }

    getChildren(): Thenable<ToolsExplorerItem[]> {
        return Promise.resolve(getToolsExplorerItems());
    }

    openTreeItemInBrowser(item: ToolsExplorerItem): void {
        openToolPage(item.tool);
    }
}