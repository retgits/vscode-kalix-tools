'use strict';

import * as sls from '../../akkasls';
import * as base from './projectBaseTreeItem';
import * as service from '../../datatypes/services/service';
import * as vscode from 'vscode';
import { aslogger } from '../../utils/logger';
import * as table from 'cli-table3';

export const ITEM_TYPE = 'Services';

export class ServiceTreeItem extends base.TreeItem {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly service: service.Service,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, ITEM_TYPE);
    }

    getUID(): string {
        return this.service.metadata.uid;
    }

    getIcon(): vscode.ThemeIcon {
        if (this.label === ITEM_TYPE) {
            return new vscode.ThemeIcon('cloud');
        }
        return new vscode.ThemeIcon('cloud-upload');
    }

    id = this.getUID();

    iconPath = this.getIcon();

    contextValue = ITEM_TYPE;

    printDetails() {
        if (this.label !== ITEM_TYPE) {
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

export async function getServiceTreeItems(parentProjectID: string, akkasls: sls.AkkaServerless): Promise<ServiceTreeItem[]> {
    let services: ServiceTreeItem[] = [];

    let servicesList = await akkasls.getServices(parentProjectID);

    for (let service of servicesList) {
        services.push(new ServiceTreeItem(service.metadata.name, parentProjectID, service, vscode.TreeItemCollapsibleState.None));
    }

    return services;
}

export function getDefaultServiceTreeItem(parentProjectID: string): ServiceTreeItem {
    return new ServiceTreeItem(ITEM_TYPE, parentProjectID, { metadata: { name: '', uid: `${parentProjectID}-${ITEM_TYPE}` } }, vscode.TreeItemCollapsibleState.Collapsed);
}