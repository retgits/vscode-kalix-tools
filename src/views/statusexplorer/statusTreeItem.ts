'use strict';

import axios from 'axios';
import * as vscode from 'vscode';

const CHECK_CODICON = 'check';
const ERROR_CODICON = 'error';

export class StatusTreeItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly iconPath: vscode.ThemeIcon,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }
}

export async function getServiceStatus(): Promise<StatusTreeItem[]> {
    let items: StatusTreeItem[] = [];

    let services = await axios.get('https://statuspal.io/api/v1/status_pages/cloudstate-com/status');

    for (const service of services.data.services) {
        let codicon = getStatusIcon(service.current_incident_type);
        items.push(new StatusTreeItem(service.name, codicon, vscode.TreeItemCollapsibleState.None));
    }

    return Promise.resolve(items);
}

function getStatusIcon(status: string): vscode.ThemeIcon {
    if (status === null) {
        return new vscode.ThemeIcon(CHECK_CODICON);
    }
    return new vscode.ThemeIcon(ERROR_CODICON);
}