import { AkkaServerless } from '../../../akkasls';
import { ProjectBaseTreeItem } from './projectBaseTreeItem';
import { Credential } from '../../../akkasls/datatypes/docker/credentials';
import { TreeItemCollapsibleState, ThemeIcon} from 'vscode';
import { aslogger } from '../../../utils/logger';
import * as table from 'cli-table3';

export const DOCKER_ITEM_TYPE = 'Credentials';

export class DockerTreeItem extends ProjectBaseTreeItem {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly credential: Credential,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, DOCKER_ITEM_TYPE);
    }

    getName(): string {
        let elems = this.credential.name.split('/');
        return elems[elems.length-1];
    }

    description = this.credential.server;

    getIcon(): ThemeIcon {
        return new ThemeIcon('lock');
    }

    id = this.getName();

    iconPath = this.getIcon();

    contextValue = DOCKER_ITEM_TYPE;

    printDetails() {
        if (this.label !== DOCKER_ITEM_TYPE) {
            let printTable = new table({});
            printTable.push(['Name', this.getName()]);
            printTable.push(['Server', this.credential.server]);
            printTable.push(['Username', this.credential.username]);
            aslogger.log(printTable.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
        }
    }
}

export async function getDockerTreeItems(parentProjectID: string, akkasls: AkkaServerless): Promise<DockerTreeItem[]> {
    let items: DockerTreeItem[] = [];

    let credentialList = await akkasls.listDockerCredentials(parentProjectID);

    for (let credential of credentialList) {
        items.push(new DockerTreeItem(credential.server, parentProjectID, credential, TreeItemCollapsibleState.None));
    }

    return items;
}

export function getDefaultDockerTreeItem(parentProjectID: string): DockerTreeItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new DockerTreeItem(DOCKER_ITEM_TYPE, parentProjectID,{ name: `${parentProjectID}-${DOCKER_ITEM_TYPE}`, server: '', username: ''}, TreeItemCollapsibleState.Collapsed);
}