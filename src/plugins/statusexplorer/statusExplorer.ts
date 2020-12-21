import { TreeDataProvider, EventEmitter, Event, commands, Uri } from 'vscode';
import { config } from '../../config';
import { StatusExplorerItem, getServiceStatus } from './statusExplorerItem';

export class StatusExplorer implements TreeDataProvider<StatusExplorerItem> {
    private _onDidChangeTreeData: EventEmitter<StatusExplorerItem | undefined | void> = new EventEmitter<StatusExplorerItem | undefined | void>();
    readonly onDidChangeTreeData: Event<StatusExplorerItem | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: StatusExplorerItem): StatusExplorerItem {
        return element;
    }

    getChildren(): Thenable<StatusExplorerItem[]> {
        return Promise.resolve(getServiceStatus());
    }

    openTreeItemInBrowser(): void {
        commands.executeCommand('vscode.open', Uri.parse(config.statusPageURL));
    }
}