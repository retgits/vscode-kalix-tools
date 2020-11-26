'use strict';

import axios from 'axios';
import { shell } from '../../utils/shell';
import * as tool from '../../datatypes/tool';
import * as vscode from 'vscode';

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
    }
]
`;

export class ToolTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly tool: tool.Tool,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }

    description = this.tool.currentVersion;

    iconPath = getStatus(this.label);

    contextValue = 'Tools';
}

export async function getToolTreeItems(): Promise<ToolTreeItem[]> {
    let tools: ToolTreeItem[] = [];

    let toolsList = tool.Convert.toToolArray(toolsJSON);

    for (let tool of toolsList) {
        tool.currentVersion = await getVersion(tool);
        tools.push(new ToolTreeItem(tool.name, tool, vscode.TreeItemCollapsibleState.None));
    }

    return tools;
}

async function getVersion(tool: tool.Tool): Promise<string> {
    let shellResult = await shell.exec(`${tool.name} ${tool.versionCmd}`);
    let version = shellResult.stdout;
    if (tool.updateURL) {
        checkUpdatesAvailable(tool, version);
    }
    return version;
}

function getStatus(cmd: string): vscode.ThemeIcon {
    if (shell.existsInPath(cmd)) {
        return new vscode.ThemeIcon(EXISTS_CODICON);
    }
    vscode.window.showErrorMessage(`Unable to find ${cmd} in PATH`);
    return new vscode.ThemeIcon(NOT_EXISTS_CODICON);
}

function checkUpdatesAvailable(tool: tool.Tool, version: string) {
    axios.get(tool.updateURL!).then((response) => {
        if (response.data !== version) {
            vscode.window.showErrorMessage(`There is a newer version of ${tool.name} available! You have ${version} and ${response.data} is the latest version`);
        }
    });
}

export function openToolPage(tool: tool.Tool) {
    if (tool.infoURL) {
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(tool.infoURL));
    }
}