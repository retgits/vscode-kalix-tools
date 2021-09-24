import * as vscode from 'vscode';

/**
 * The ProjectExplorerNode is the abstract class on which all other project explorer nodes extend
 *
 * @export
 * @class ProjectExplorerNode
 * @extends {vscode.TreeItem}
 */
export abstract class ProjectExplorerNode extends vscode.TreeItem {
    public readonly type: string;
    public readonly parentProjectID: string;

    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, type: string, parentProjectID?: string) {
        super(label, collapsibleState);
        this.type = type;
        this.parentProjectID = (parentProjectID) ? parentProjectID : 'none';
    }

    abstract print(): void;
}