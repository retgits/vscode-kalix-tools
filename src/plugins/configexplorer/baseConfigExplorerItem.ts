import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export abstract class BaseConfigExplorerItem extends TreeItem {
    public readonly type: string;

    constructor(label: string, collapsibleState: TreeItemCollapsibleState, type: string) {
        super(label, collapsibleState);
        this.type = type;
    }

    abstract printDetails(): void;
}