'use strict';

import { AkkaServerless } from '../../akkasls';
import { ProjectBaseTreeItem } from './projectBaseTreeItem';
import { Service } from '../../datatypes/services/service';
import { TreeItemCollapsibleState, ThemeIcon} from 'vscode';
import { aslogger } from '../../utils/logger';
import * as table from 'cli-table3';

export const SERVICE_ITEM_TYPE = 'Services';

export class ServiceTreeItem extends ProjectBaseTreeItem {
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

    printDetails() {
        if (this.label !== SERVICE_ITEM_TYPE) {
            let printTable = new table({
                head: ['Item', 'Description']
            });
            printTable.push(['Name', this.service.metadata.name]);
            printTable.push(['Status', this.service.status?.summary]);
            printTable.push(['Created on', new Date(this.service.metadata.creationTimestamp!).toLocaleString()]);
            printTable.push(['Generation', this.service.metadata.generation]);
            if (this.service.spec?.containers) {
                let containers: string[] = [];
                for (let container of this.service.spec.containers) {
                    containers.push(container.image!);
                }
                printTable.push(['Container images', containers.join('\n')]);
            }
            printTable.push(['Replicas', this.service.spec?.replicas]);
            aslogger.log(printTable.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
        }
    }
}

export async function GetServiceTreeItems(parentProjectID: string, akkasls: AkkaServerless): Promise<ServiceTreeItem[]> {
    let services: ServiceTreeItem[] = [];

    let servicesList = await akkasls.getServices(parentProjectID);

    for (let service of servicesList) {
        services.push(new ServiceTreeItem(service.metadata.name, parentProjectID, service, TreeItemCollapsibleState.None));
    }

    return services;
}

export function GetDefaultServiceTreeItem(parentProjectID: string): ServiceTreeItem {
    return new ServiceTreeItem(SERVICE_ITEM_TYPE, parentProjectID, { metadata: { name: '', uid: `${parentProjectID}-${SERVICE_ITEM_TYPE}` } }, TreeItemCollapsibleState.Collapsed);
}