import * as vscode from 'vscode';
import { ERROR_ICON, OKAY_ICON, URLS } from '../../utils/constants';
import got from 'got';

/**
 * A StatusNode is a single item that has an entry on the status page.
 *
 * @export
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

    let result = await got(URLS.statusapi,{responseType: 'json'});

    for (const service of JSON.parse(result.rawBody.toString()).services) {
        let codicon = OKAY_ICON;
        if (service.current_incident_type !== null) {
            codicon = ERROR_ICON;
        }
        items.push(new StatusNode(service.name.replace('Akkaserverless ', '').replace('Lightbend ', ''), codicon, vscode.TreeItemCollapsibleState.None));
    }

    return Promise.resolve(items);
}