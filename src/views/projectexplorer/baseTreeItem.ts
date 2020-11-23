'use strict'

import * as vscode from 'vscode';

export abstract class TreeItem extends vscode.TreeItem {
    public readonly type: string;
    public readonly parentProjectID: string;

    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, type: string, parentProjectID?: string) {
        super(label, collapsibleState)
        this.type = type;
        this.parentProjectID = (parentProjectID) ? parentProjectID : 'none'
    }

    printDetails() {}
}