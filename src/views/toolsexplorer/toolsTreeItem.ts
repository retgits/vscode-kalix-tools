'use strict';

import axios from 'axios';
import { Convert } from '../../datatypes/converter';
import { shell } from '../../utils/shell';
import { Tool } from '../../datatypes/tool';
import { TreeItem, TreeItemCollapsibleState, ThemeIcon, window, Uri, commands } from 'vscode';

const EXISTS_CODICON = 'pass';
const NOT_EXISTS_CODICON = 'error';

const toolsJSON: string = `
[
    {
        "name": "akkasls",
        "versionCmd": "version",
        "infoURL": "https://docs.cloudstate.com/getting-started/set-up-development-env.html#_cloudstate_cli",
        "updateURL": "https://downloads.lbcs.io/stable/version.txt"
    },
    {
        "name": "docker",
        "versionCmd": "version --format '{{.Client.Version}}'",
        "infoURL": "https://docs.docker.com/desktop/"
    },
    {
        "name": "git",
        "versionCmd": "--version",
        "infoURL": "https://git-scm.com/downloads"
    }
]
`;

export class ToolTreeItem extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly tool: Tool,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }

    description = this.tool.currentVersion;

    iconPath = getStatus(this.label);

    contextValue = 'Tools';
}

export async function GetToolTreeItems(): Promise<ToolTreeItem[]> {
    let tools: ToolTreeItem[] = [];

    let toolsList = Convert.toToolArray(toolsJSON);

    for (let tool of toolsList) {
        tool.currentVersion = await getVersion(tool);
        tools.push(new ToolTreeItem(tool.name, tool, TreeItemCollapsibleState.None));
    }

    return tools;
}

async function getVersion(tool: Tool): Promise<string> {
    let shellResult = await shell.exec(`${tool.name} ${tool.versionCmd}`);
    let version = shellResult.stdout;
    if (tool.updateURL) {
        checkUpdatesAvailable(tool, version);
    }
    return version;
}

function getStatus(cmd: string): ThemeIcon {
    if (shell.existsInPath(cmd)) {
        return new ThemeIcon(EXISTS_CODICON);
    }
    window.showErrorMessage(`Unable to find ${cmd} in PATH`);
    return new ThemeIcon(NOT_EXISTS_CODICON);
}

function checkUpdatesAvailable(tool: Tool, version: string) {
    axios.get(tool.updateURL!).then((response) => {
        if (response.data !== version) {
            window.showErrorMessage(`There is a newer version of ${tool.name} available! You have ${version} and ${response.data} is the latest version`);
        }
    });
}

export function OpenToolPage(tool: Tool) {
    if (tool.infoURL) {
        commands.executeCommand('vscode.open', Uri.parse(tool.infoURL));
    }
}