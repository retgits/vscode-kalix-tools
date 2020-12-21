import { AkkaServerless } from '../../akkasls';
import { BaseProjectExplorerItem } from './baseProjectExplorerItem';
import { Service } from '@retgits/akkasls-nodewrapper';
import { TreeItemCollapsibleState, ThemeIcon} from 'vscode';
import { logger } from '../../utils/logger';
import * as table from 'cli-table3';

export const SERVICE_ITEM_TYPE = 'Services';

export class ServiceItem extends BaseProjectExplorerItem {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly service: Service,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, SERVICE_ITEM_TYPE);
    }

    getUID(): string {
        return this.service.metadata.uid;
    }

    getIcon(): ThemeIcon {
        if (this.label === SERVICE_ITEM_TYPE) {
            return new ThemeIcon('cloud');
        }
        return new ThemeIcon('cloud-upload');
    }

    id = this.getUID();

    iconPath = this.getIcon();

    contextValue = SERVICE_ITEM_TYPE;

    printDetails(): void {
        if (this.label !== SERVICE_ITEM_TYPE) {
            const printTable = new table({
                head: ['Item', 'Description']
            });
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
            logger.log(printTable.toString());
        }
    }
}

export async function getServiceItems(parentProjectID: string, akkasls: AkkaServerless): Promise<ServiceItem[]> {
    const services: ServiceItem[] = [];

    const servicesList = await akkasls.listServices(parentProjectID);

    for (const service of servicesList) {
        services.push(new ServiceItem(service.metadata.name, parentProjectID, service, TreeItemCollapsibleState.None));
    }

    return services;
}

export function getDefaultServiceItem(parentProjectID: string): ServiceItem {
    return new ServiceItem(SERVICE_ITEM_TYPE, parentProjectID, { metadata: { name: '', uid: `${parentProjectID}-${SERVICE_ITEM_TYPE}` } }, TreeItemCollapsibleState.Collapsed);
}