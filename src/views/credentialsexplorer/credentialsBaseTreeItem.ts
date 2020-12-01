'use strict';

import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export abstract class CredentialsBaseTreeItem extends TreeItem {
    public readonly type: string;

    constructor(label: string, collapsibleState: TreeItemCollapsibleState, type: string) {
        super(label, collapsibleState);
        this.type = type;
    }

    printDetails() { }
}