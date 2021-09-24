import * as vscode from 'vscode';
import { logger } from '../../utils/logger';
import { ProjectExplorerNode } from './projectexplorernode';
import { table } from 'table';
import { SERVICE_ITEM_TYPE } from '../../utils/constants';
import { Convert, Service } from '../akkasls/api';
import { listServices } from '../akkasls/services/listServices';
import { getConfiguration } from '../../utils/config';

/**
 * The ServiceNode is a node that captures the information of services in a project
 *
 * @class ServiceNode
 * @extends {ProjectNode}
 */
export class ServiceNode extends ProjectExplorerNode {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly service: Service,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, SERVICE_ITEM_TYPE);
    }

    getUID(): string {
        return this.service.metadata.uid;
    }

    getIcon(): vscode.ThemeIcon {
        if (this.label === SERVICE_ITEM_TYPE) {
            return new vscode.ThemeIcon('cloud');
        }
        return new vscode.ThemeIcon('cloud-upload');
    }

    id = this.getUID();

    iconPath = this.getIcon();

    contextValue = SERVICE_ITEM_TYPE;

    print(): void {
        if (this.label !== SERVICE_ITEM_TYPE) {
            const printTable = [];
            printTable.push(['Name', this.service.metadata.name]);
            printTable.push(['Status', this.service.status?.summary]);
            printTable.push(['Created on', new Date(this.service.metadata.creationTimestamp!).toLocaleString()]);
            printTable.push(['Generation', this.service.metadata.generation]);
            if (this.service.spec?.containers) {
                const containers: string[] = [];
                for (const container of this.service.spec.containers) {
                    containers.push(container.image!);
                }
                printTable.push(['Container images', containers.join('\n')]);
            }
            printTable.push(['Replicas', this.service.spec?.replicas]);
            logger.log(table(printTable), `Service details for: ${this.service.metadata.name}`);
        }
    }
}

/**
 * The getServices command retrieves all services for a single project based on the
 * projectID
 *
 * @param {string} parentProjectID
 * @return {*}  {(Promise<ServiceNode[]>)}
 */
export async function getServices(parentProjectID: string): Promise<ServiceNode[]> {
    const services: ServiceNode[] = [];

    const result = await listServices(parentProjectID, getConfiguration());

    if (result.code !== undefined) {
        vscode.window.showErrorMessage(`Unable to obtain services: ${result.stderr}`);
        return services;
    }

    const servicesList = Convert.toService(result.stdout!);

    for (const service of servicesList) {
        services.push(new ServiceNode(service.metadata.name, parentProjectID, service, vscode.TreeItemCollapsibleState.None));
    }

    return services;
}

/**
 * The getServicePlaceholder creates a placeholder that can be shown in the tree for
 * Service nodes
 *
 * @param {string} parentProjectID
 * @return {*}  {ServiceNode}
 */
export function getServicePlaceholder(parentProjectID: string): ServiceNode {
    return new ServiceNode(SERVICE_ITEM_TYPE, parentProjectID, { metadata: { name: '', uid: `${parentProjectID}-${SERVICE_ITEM_TYPE}` } }, vscode.TreeItemCollapsibleState.Collapsed);
}