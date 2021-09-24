import * as vscode from 'vscode';
import { REGISTRY_CREDENTIALS_ITEM_TYPE } from '../../utils/constants';
import { logger } from '../../utils/logger';
import { ProjectExplorerNode } from './projectexplorernode';
import { table } from 'table';
import { Convert, RegistryCredential } from '../akkasls/api';
import { listCredentials } from '../akkasls/docker/listCredentials';
import { getConfiguration } from '../../utils/config';

/**
 * The ContainerRegistryCredentialNode is a node that captures the information of
 * container registry account (called docker credentials in Akka Serverless)
 *
 * @class ContainerRegistryCredentialNode
 * @extends {ProjectExplorerNode}
 */
export class ContainerRegistryCredentialNode extends ProjectExplorerNode {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly credential: RegistryCredential,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, REGISTRY_CREDENTIALS_ITEM_TYPE);
    }

    getName(): string {
        const elems = this.credential.name.split('/');
        return elems[elems.length - 1];
    }

    description = this.credential.server;

    id = this.getName();

    iconPath = new vscode.ThemeIcon('lock');

    contextValue = REGISTRY_CREDENTIALS_ITEM_TYPE;

    print(): void {
        if (this.label !== REGISTRY_CREDENTIALS_ITEM_TYPE) {
            const printTable = [];
            printTable.push(['Name', this.getName()]);
            printTable.push(['Server', this.credential.server]);
            printTable.push(['Username', this.credential.username]);
            logger.log(table(printTable), `Container Registry Credential details for: ${this.getName()}`);
        }
    }
}

/**
 * The getContainerRegistryCredentials command retrieves all current configured
 * container registry credentials for a single project based on the projectID
 *
 * @param {string} parentProjectID
 * @return {*}  {(Promise<ContainerRegistryCredentialNode[]>)}
 */
export async function getContainerRegistryCredentials(parentProjectID: string): Promise<ContainerRegistryCredentialNode[]> {
    const items: ContainerRegistryCredentialNode[] = [];

    const creds = await listCredentials(parentProjectID, getConfiguration());

    if (creds.code !== undefined) {
        vscode.window.showErrorMessage(`Unable to obtain credentials: ${creds.stderr}`);
        return items;
    }

    const credentialList = Convert.toRegistryCredential(creds.stdout!);

    for (const credential of credentialList) {
        items.push(new ContainerRegistryCredentialNode(credential.server, parentProjectID, credential, vscode.TreeItemCollapsibleState.None));
    }

    return items;
}

/**
 * The getContainerRegistryCredentialPlaceholder creates a placeholder that can be
 * shown in the tree for ContainerRegistryCredential nodes
 *
 * @param {string} parentProjectID
 * @return {*}  {ContainerRegistryCredentialNode}
 */
export function getContainerRegistryCredentialPlaceholder(parentProjectID: string): ContainerRegistryCredentialNode {
    return new ContainerRegistryCredentialNode(REGISTRY_CREDENTIALS_ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${REGISTRY_CREDENTIALS_ITEM_TYPE}`, server: '', username: '', email: '' }, vscode.TreeItemCollapsibleState.Collapsed);
}