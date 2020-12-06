import { AkkaServerless } from '../../../akkasls';
import { ConfigBaseTreeItem } from './configBaseTreeItem';
import { getTokenTreeItems, TOKEN_ITEM_TYPE, getDefaultTokenTreeItem } from './tokenTreeItem';
import { TreeDataProvider, EventEmitter, Event, TreeItem } from 'vscode';

export class ConfigExplorer implements TreeDataProvider<ConfigBaseTreeItem> {
    private _onDidChangeTreeData: EventEmitter<ConfigBaseTreeItem | undefined | void> = new EventEmitter<ConfigBaseTreeItem | undefined | void>();
    readonly onDidChangeTreeData: Event<ConfigBaseTreeItem | undefined | void> = this._onDidChangeTreeData.event;
    private _akkasls: AkkaServerless;

    constructor(akkasls: AkkaServerless) {
        this._akkasls = akkasls;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ConfigBaseTreeItem): TreeItem {
        return element;
    }

    getChildren(element?: ConfigBaseTreeItem): Thenable<ConfigBaseTreeItem[]> {
        if (element) {
            switch (element.type) {
                case TOKEN_ITEM_TYPE:
                    return Promise.resolve(getTokenTreeItems(this._akkasls));
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(this.getDefaultCredentialItems());
    }

    getDefaultCredentialItems(): Promise<ConfigBaseTreeItem[]> {
        let defaultTreeItems: ConfigBaseTreeItem[] = [];
        defaultTreeItems.push(getDefaultTokenTreeItem());
        return Promise.resolve(defaultTreeItems);
    }

    async printTreeItemDetails(base: ConfigBaseTreeItem) {
        base.printDetails();
    }
}