// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// External dependencies
import axios from 'axios';

// Internal dependencies
import { config } from '../../config';
import { openBrowser } from '../../browser';

const CHECK_CODICON = 'check';
const ERROR_CODICON = 'error';

/**
 * A StatusNode represents a single item of the Akka Serverless hosted service that has an
 * entry on the status page.
 *
 * @class StatusNode
 * @extends {vscode.TreeItem}
 */
export class StatusNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly iconPath: vscode.ThemeIcon,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }
}

/**
 * The getServiceStatus command reads the status page API and creates StatusNode
 * objects from each of them to display on the screen.
 *
 * @return {*}  {Promise<StatusNode[]>}
 */
export async function getServiceStatus(): Promise<StatusNode[]> {
    const items: StatusNode[] = [];

    const services = await axios.get(config.urls.statusapi);

    for (const service of services.data.services) {
        const codicon = getStatusIcon(service.current_incident_type);
        items.push(new StatusNode(service.name, codicon, vscode.TreeItemCollapsibleState.None));
    }

    return Promise.resolve(items);
}

/**
 * The getStatusIcon command checks the current status of the hosted Akka Serverless
 * item and returns a theme icon based on that status. If no status is found, that means
 * there are no issues and a "okay" icon is returned.
 *
 * @param {string} status The status of the Akka Serverless item
 * @return {*}  {vscode.ThemeIcon} The icon
 */
function getStatusIcon(status: string): vscode.ThemeIcon {
    if (status === null) {
        return new vscode.ThemeIcon(CHECK_CODICON);
    }
    return new vscode.ThemeIcon(ERROR_CODICON);
}

/**
 * The StatusExplorer represents a tree of status items that can be shown and interacted with
 *
 * @class StatusExplorer
 * @implements {vscode.TreeDataProvider<ToolNode>}
 */
export class StatusExplorer implements vscode.TreeDataProvider<StatusNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<StatusNode | undefined | void> = new vscode.EventEmitter<StatusNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<StatusNode | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: StatusNode): StatusNode {
        return element;
    }

    getChildren(): Thenable<StatusNode[]> {
        return Promise.resolve(getServiceStatus());
    }

    openStatusInfoPage(): void {
        openBrowser(config.urls.statusapi);
    }
}