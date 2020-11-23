'use strict'

import * as sls from '../../akkasls';
import * as base from './baseTreeItem';
import * as service from '../../datatypes/service';
import * as vscode from 'vscode';
import { aslogger } from '../../utils/logger';
import * as deployService from '../../cliwrapper/services/deploy'
import * as exposeService from '../../cliwrapper/services/expose'
import * as undeployService from '../../cliwrapper/services/undeploy'
import * as unexposeService from '../../cliwrapper/services/unexpose'

const Table = require('cli-table');

// Constants
export const ITEM_TYPE = 'Services'

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
        return this.service.metadata.uid
    }

    getIcon(): vscode.ThemeIcon {
        if (this.label == ITEM_TYPE) {
            return new vscode.ThemeIcon('cloud')
        }
        return new vscode.ThemeIcon('cloud-upload')
    }

    id = this.getUID()

    iconPath = this.getIcon()

    contextValue = ITEM_TYPE

    printDetails() {
        if (this.label != ITEM_TYPE) {
            const table = new Table({})
            table.push(['Name',this.service.metadata.name])
            table.push(['Status',this.service.status?.summary])
            table.push(['Created on',new Date(this.service.metadata.creationTimestamp!).toLocaleString()])
            table.push(['Generation',this.service.metadata.generation])
            if (this.service.spec?.containers) {
                let containers: string = ''
                for (let container of this.service.spec.containers) {
                    containers += `${container.image}\n`
                }
                table.push(['Container images',containers])
            }
            table.push(['Replicas',this.service.spec?.replicas])
            aslogger.log(table.toString())
        }
    }
}

export async function Get(parentProjectID: string, akkasls: sls.AkkaServerless): Promise<ServiceTreeItem[]> {
    let services: ServiceTreeItem[] = []

    let servicesList = await akkasls.getServicesByProject(parentProjectID)

    for (let service of servicesList) {
        services.push(new ServiceTreeItem(service.metadata.name, parentProjectID, service, vscode.TreeItemCollapsibleState.None))
    }

    return services;
}

export function DefaultItem(parentProjectID: string): ServiceTreeItem {
    return new ServiceTreeItem(ITEM_TYPE, parentProjectID, {metadata:{name:'', uid:`${parentProjectID}-${ITEM_TYPE}`}}, vscode.TreeItemCollapsibleState.Collapsed)
}

export function deploy(item: base.TreeItem) {
    deployService.fromUI(item.parentProjectID)
}

export function undeploy(item: ServiceTreeItem) {
    if (item.label != ITEM_TYPE) {
        undeployService.fromUI(item.parentProjectID, item.label)
    }
}

export function expose(item: ServiceTreeItem) {
    if (item.label != ITEM_TYPE) {
        exposeService.fromUI(item.parentProjectID, item.label)
    }
}

export function unexpose(item: ServiceTreeItem) {
    if (item.label != ITEM_TYPE) {
        unexposeService.fromUI(item.parentProjectID, item.label)
    }
}