'use strict';

import axios from 'axios';
import { ThemeIcon, TreeItemCollapsibleState, TreeItem } from 'vscode';

const CHECK_CODICON = 'check';
const ERROR_CODICON = 'error';

export class StatusTreeItem extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly iconPath: ThemeIcon,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }
}

export async function GetServiceStatus(): Promise<StatusTreeItem[]> {
    let items: StatusTreeItem[] = [];

    let services = await axios.get('https://statuspal.io/api/v1/status_pages/cloudstate-com/status');

    for (const service of services.data.services) {
        let codicon = getStatusIcon(service.current_incident_type);
        items.push(new StatusTreeItem(service.name, codicon, TreeItemCollapsibleState.None));
    }

    return Promise.resolve(items);
}

function getStatusIcon(status: string): ThemeIcon {
    if (status === null) {
        return new ThemeIcon(CHECK_CODICON);
    }
    return new ThemeIcon(ERROR_CODICON);
}