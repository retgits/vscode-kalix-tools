import { AkkaServerless } from '../../akkasls';
import { BaseProjectExplorerItem } from './baseProjectExplorerItem';
import { Credential } from '@retgits/akkasls-nodewrapper';
import { TreeItemCollapsibleState, ThemeIcon} from 'vscode';
import { logger } from '../../utils/logger';
import * as table from 'cli-table3';

export const DOCKER_ITEM_TYPE = 'Credentials';

export class DockerCredentialItem extends BaseProjectExplorerItem {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly credential: Credential,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, DOCKER_ITEM_TYPE);
    }

    getName(): string {
        const elems = this.credential.name.split('/');
        return elems[elems.length-1];
    }

    description = this.credential.server;

    id = this.getName();

    iconPath = new ThemeIcon('lock');

    contextValue = DOCKER_ITEM_TYPE;

    printDetails(): void {
        if (this.label !== DOCKER_ITEM_TYPE) {
            const printTable = new table({});
            printTable.push(['Name', this.getName()]);
            printTable.push(['Server', this.credential.server]);
            printTable.push(['Username', this.credential.username]);
            logger.log(printTable.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
        }
    }
}

export async function getDockerCredentialItems(parentProjectID: string, akkasls: AkkaServerless): Promise<DockerCredentialItem[]> {
    const items: DockerCredentialItem[] = [];

    const credentialList = await akkasls.listDockerCredentials(parentProjectID);

    for (const credential of credentialList) {
        items.push(new DockerCredentialItem(credential.server, parentProjectID, credential, TreeItemCollapsibleState.None));
    }

    return items;
}

export function getDefaultDockerCredentialItem(parentProjectID: string): DockerCredentialItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new DockerCredentialItem(DOCKER_ITEM_TYPE, parentProjectID,{ name: `${parentProjectID}-${DOCKER_ITEM_TYPE}`, server: '', username: ''}, TreeItemCollapsibleState.Collapsed);
}