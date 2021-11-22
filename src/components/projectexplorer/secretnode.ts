import * as vscode from 'vscode';
import { logger } from '../../utils/logger';
import { ProjectExplorerNode } from './projectexplorernode';
import { table } from 'table';
import { SECRET_ITEM_TYPE } from '../../utils/constants';
import { Convert, Secret } from '../akkasls/api';
import { listSecrets } from '../akkasls/secrets/listSecrets';
import { getConfiguration } from '../../utils/config';

/**
 * The SecretNode is a node that captures the information of secrets in a project
 *
 * @class SecretNode
 * @extends {ProjectNode}
 */
export class SecretNode extends ProjectExplorerNode {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly secret: Secret,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, SECRET_ITEM_TYPE);
    }

    getUID(): string {
        return this.secret.metadata.uid;
    }

    id = this.getUID();

    iconPath = new vscode.ThemeIcon('lock');

    contextValue = SECRET_ITEM_TYPE;

    print(): void {
        if (this.label !== SECRET_ITEM_TYPE) {
            const printTable = [];
            printTable.push(['Name', this.secret.metadata.name]);
            if (this.secret.spec?.data) {
                const secretKeys: string[] = [];
                if (Object.keys(this.secret.spec.data).length > 0) {
                    let keys = Object.keys(this.secret.spec.data);
                    for (let index = 0; index < keys.length; index++) {
                        const element = keys[index];
                        secretKeys.push(element);
                    }
                }
                printTable.push(['Secret keys', secretKeys.join('\n')]);
            }
            logger.log(table(printTable), `Secret details for: ${this.secret.metadata.name}`);
        }
    }
}

/**
 * The getSecrets command retrieves all secrets for a single project based on the
 * projectID
 *
 * @param {string} parentProjectID
 * @return {*}  {(Promise<SecretNode[]>)}
 */
export async function getSecrets(parentProjectID: string): Promise<SecretNode[]> {
    const secrets: SecretNode[] = [];

    const result = await listSecrets(parentProjectID, getConfiguration());

    if (result.code !== undefined) {
        vscode.window.showErrorMessage(`Unable to obtain secrets: ${result.stderr}`);
        return secrets;
    }

    const secretsList = Convert.toSecretList(result.stdout!);

    for (const secret of secretsList) {
        secrets.push(new SecretNode(secret.metadata.name, parentProjectID, secret, vscode.TreeItemCollapsibleState.None));
    }

    return secrets;
}

/**
 * The getSecretsPlaceholder creates a placeholder that can be shown in the tree for
 * Secrets nodes
 *
 * @param {string} parentProjectID
 * @return {*}  {ServiceNode}
 */
export function getSecretsPlaceholder(parentProjectID: string): SecretNode {
    return new SecretNode(SECRET_ITEM_TYPE, parentProjectID, { metadata: { name: '', uid: `${parentProjectID}-${SECRET_ITEM_TYPE}` } }, vscode.TreeItemCollapsibleState.Collapsed);
}