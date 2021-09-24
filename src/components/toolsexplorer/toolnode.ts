import * as vscode from 'vscode';
import { ERROR_ICON, OKAY_ICON, TOOLS_CONTEXT_VALUE, TOOLS } from '../../utils/constants';
import { shell } from '../../components/shell/shell';
import { Tool } from './toolsexplorer';
import got from 'got';
import { openBrowser } from '../../utils/browser';

/**
 * A ToolNode is a single tool which is shown in a ToolTree
 *
 * @class ToolNode
 * @extends {vscode.TreeItem}
 */
export class ToolNode extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tool: Tool,
        public readonly iconPath: vscode.ThemeIcon,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }

    description = this.tool.currentVersion;
    tooltip = this.tool.toolTip;
    contextValue = TOOLS_CONTEXT_VALUE;
}

/**
 * The getToolNodes command reads the required tools from the config module and
 * returns an array of ToolNodes to be presented in the ToolTree
 *
 * @return {*}  {Promise<ToolNode[]>}
 */
export async function getToolNodes(): Promise<ToolNode[]> {
    const tools: ToolNode[] = [];

    for (const tool of TOOLS) {
        const version = await getToolVersion(tool);
        if (version) {
            tool.currentVersion = version;
        }

        let icon = OKAY_ICON;
        const res = await shell.which(tool.name);
        if (res === null) {
            vscode.window.showErrorMessage(`Unable to find ${tool.name} in PATH`);
            icon = ERROR_ICON;
        }


        tools.push(new ToolNode(tool.name, tool, icon, vscode.TreeItemCollapsibleState.None));
    }

    return tools;
}

/**
 * The getToolVersion command tries to get the version of a tool and checks whether updates
 * are available.
 *
 * @param {Tool} tool The tool to get the version for
 * @return {*}  {Promise<string>} A promise of the tool version as a string
 */
async function getToolVersion(tool: Tool): Promise<string | undefined> {
    // Get the version
    const result = await shell.exec(`${tool.name} ${tool.versionCmd}`);
    if (result) {
        tool.currentVersion = result.stdout;
        if (tool.updateURL) {
            let result = await got(tool.updateURL);
            if (result.rawBody.toString() !== tool.currentVersion) {
                vscode.window.showInformationMessage(`There is a newer version of ${tool.name} available! You have ${tool.currentVersion} and ${result.rawBody.toString()} is the latest version`, {}, ...['Open Browser', 'Cancel']).then(selection => {
                    if (selection === 'Open Browser') {
                        openBrowser(tool.infoURL!);
                    }
                });
            }
        }
        return tool.currentVersion;
    }

    return undefined;
}