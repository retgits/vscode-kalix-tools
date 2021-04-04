// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// External dependencies
import axios from 'axios';

// Internal dependencies
import { config } from '../../config';
import { shell } from '../../shell';
import { openBrowser } from '../../browser';

const EXISTS_CODICON = 'pass';
const NOT_EXISTS_CODICON = 'error';
const TOOLS_CONTEXT_VALUE = 'Tools';

/**
 * The interface Tool is a representation of a command line tool that can be used by the
 * Akka Serverless VS Code extension.
 */
export interface Tool {
    name: string;
    versionCmd: string;
    toolTip?: string;
    currentVersion?: string;
    infoURL?: string;
    updateURL?: string;
}

/**
 * A ToolNode represents a single command line too that can be used by the Akka
 * Serverless VS Code Extension and is shown in a ToolTree
 *
 * @class ToolNode
 * @extends {vscode.TreeItem}
 */
export class ToolNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tool: Tool,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }

    iconPath = this.getStatus(this.tool.name);
    description = this.tool.currentVersion;
    tooltip = this.tool.toolTip;
    contextValue = TOOLS_CONTEXT_VALUE;

    getStatus(cmd: string): vscode.ThemeIcon {
        if (shell.which(cmd)) {
            return new vscode.ThemeIcon(EXISTS_CODICON);
        }
        vscode.window.showErrorMessage(`Unable to find ${cmd} in PATH`);
        return new vscode.ThemeIcon(NOT_EXISTS_CODICON);
    }
}

/**
 * The getToolNodes command reads the required tools from the config module and
 * returns an array of ToolNodes to be presented in the ToolTree
 *
 * @return {*}  {Promise<ToolNode[]>}
 */
export async function getToolNodes(): Promise<ToolNode[]> {
    const tools: ToolNode[] = [];

    for (const tool of config.tools) {
        const version = await getVersion(tool);
        if (version) {
            tool.currentVersion = version;
        }
        tools.push(new ToolNode(tool.name, tool, vscode.TreeItemCollapsibleState.None));
    }

    return tools;
}

/**
 * The getVersion command tries to get the version of a tool and checks whether updates
 * are available.
 *
 * @param {Tool} tool The tool to get the version for
 * @return {*}  {Promise<string>} A promise of the tool version as a string
 */
async function getVersion(tool: Tool): Promise<string | undefined> {
    // Get the version
    const result = await shell.exec(`${tool.name} ${tool.versionCmd}`);
    if (result) {
        tool.currentVersion = result.stdout;
        if (tool.updateURL) {
            checkUpdatesAvailable(tool);
        }
        return tool.currentVersion;
    }

    return undefined;
}

/**
 * The checkUpdatesAvailable checks whether the current version of the tool is the latest
 * available version. If not, a warning message will be displayed that a nwer version is
 * avaialble.
 *
 * @param {Tool} tool The tool to check updates for
 * @param {string} version The current version of the tool
 */
function checkUpdatesAvailable(tool: Tool) {
    axios.get(tool.updateURL!).then((response) => {
        if (response.data !== tool.currentVersion) {
            vscode.window.showErrorMessage(`There is a newer version of ${tool.name} available! You have ${tool.currentVersion} and ${response.data} is the latest version`);
        }
    });
}

/**
 * The ToolExplorer represents a tree of tools that can be shown and interacted with
 *
 * @class ToolsExplorer
 * @implements {vscode.TreeDataProvider<ToolNode>}
 */
export class ToolsExplorer implements vscode.TreeDataProvider<ToolNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<ToolNode | undefined | void> = new vscode.EventEmitter<ToolNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<ToolNode | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ToolNode): vscode.TreeItem {
        return element;
    }

    getChildren(): Thenable<ToolNode[]> {
        return Promise.resolve(getToolNodes());
    }

    openToolInfoPage(item: ToolNode): void {
        if (item.tool.infoURL) {
            openBrowser(item.tool.infoURL);
        }
    }
}