import axios from 'axios';
import { config } from '../../config';
import { Tool } from './datatypes';
import { TreeItem, TreeItemCollapsibleState, ThemeIcon, window, Uri, commands } from 'vscode';
import { Command, shell } from '@retgits/akkasls-nodewrapper';

const EXISTS_CODICON = 'pass';
const NOT_EXISTS_CODICON = 'error';

export class ToolsExplorerItem extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly tool: Tool,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }

    iconPath = this.getStatus(this.tool.name);

    description = this.tool.currentVersion;

    tooltip = this.tool.toolTip;

    contextValue = 'Tools';

    getStatus(cmd: string): ThemeIcon {
        if (shell.existsInPath(cmd)) {
            return new ThemeIcon(EXISTS_CODICON);
        }
        window.showErrorMessage(`Unable to find ${cmd} in PATH`);
        return new ThemeIcon(NOT_EXISTS_CODICON);
    }
}

export async function getToolsExplorerItems(): Promise<ToolsExplorerItem[]> {
    const tools: ToolsExplorerItem[] = [];

    for (const tool of config.tools) {
        tool.currentVersion = await getVersion(tool);
        tools.push(new ToolsExplorerItem(tool.name, tool, TreeItemCollapsibleState.None));
    }

    return tools;
}

async function getVersion(tool: Tool): Promise<string> {
    const version = await toolVersion(tool.name, tool.versionCmd);
    if (tool.updateURL) {
        checkUpdatesAvailable(tool, version);
    }
    return version;
} 

function checkUpdatesAvailable(tool: Tool, version: string) {
    axios.get(tool.updateURL!).then((response) => {
        if (response.data !== version) {
            window.showErrorMessage(`There is a newer version of ${tool.name} available! You have ${version} and ${response.data} is the latest version`);
        }
    });
}

export function openToolPage(tool: Tool): void {
    if (tool.infoURL) {
        commands.executeCommand('vscode.open', Uri.parse(tool.infoURL));
    }
}

async function toolVersion(tool: string, versionCmd: string): Promise<string> {
    const res = await new Command(`${tool} ${versionCmd}`).run();
    return res.stdout;
}