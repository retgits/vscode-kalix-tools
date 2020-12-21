import { AkkaServerless } from '../../akkasls';
import { BaseConfigExplorerItem } from './baseConfigExplorerItem';
import { getAuthTokenItems, TOKEN_ITEM_TYPE, getDefaultAuthTokenItem } from './authTokenItem';
import { TreeDataProvider, EventEmitter, Event, TreeItem } from 'vscode';

export class ConfigExplorer implements TreeDataProvider<BaseConfigExplorerItem> {
    private _onDidChangeTreeData: EventEmitter<BaseConfigExplorerItem | undefined | void> = new EventEmitter<BaseConfigExplorerItem | undefined | void>();
    readonly onDidChangeTreeData: Event<BaseConfigExplorerItem | undefined | void> = this._onDidChangeTreeData.event;
    private _akkasls: AkkaServerless;

    constructor(akkasls: AkkaServerless) {
        this._akkasls = akkasls;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: BaseConfigExplorerItem): TreeItem {
        return element;
    }

    getChildren(element?: BaseConfigExplorerItem): Thenable<BaseConfigExplorerItem[]> {
        if (element) {
            switch (element.type) {
                case TOKEN_ITEM_TYPE:
                    return Promise.resolve(getAuthTokenItems(this._akkasls));
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(this.getDefaultCredentialItems());
    }

    getDefaultCredentialItems(): Promise<BaseConfigExplorerItem[]> {
        const defaultTreeItems: BaseConfigExplorerItem[] = [];
        defaultTreeItems.push(getDefaultAuthTokenItem());
        return Promise.resolve(defaultTreeItems);
    }

    async printTreeItemDetails(base: BaseConfigExplorerItem): Promise<void> {
        base.printDetails();
    }
}