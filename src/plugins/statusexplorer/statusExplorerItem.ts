import axios from 'axios';
import { ThemeIcon, TreeItemCollapsibleState, TreeItem } from 'vscode';
import { config } from '../../config';

const CHECK_CODICON = 'check';
const ERROR_CODICON = 'error';

export class StatusExplorerItem extends TreeItem {
    constructor(
        public readonly label: string,
        public readonly iconPath: ThemeIcon,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState);
    }
}

export async function getServiceStatus(): Promise<StatusExplorerItem[]> {
    const items: StatusExplorerItem[] = [];

    const services = await axios.get(config.statusPageAPI);

    for (const service of services.data.services) {
        const codicon = getStatusIcon(service.current_incident_type);
        items.push(new StatusExplorerItem(service.name, codicon, TreeItemCollapsibleState.None));
    }

    return Promise.resolve(items);
}

function getStatusIcon(status: string): ThemeIcon {
    if (status === null) {
        return new ThemeIcon(CHECK_CODICON);
    }
    return new ThemeIcon(ERROR_CODICON);
}