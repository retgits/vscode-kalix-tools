'use strict';

import * as vscode from 'vscode';

export abstract class TreeItem extends vscode.TreeItem {
    public readonly type: string;

    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, type: string) {
        super(label, collapsibleState);
        this.type = type;
    }

    printDetails() { }
}