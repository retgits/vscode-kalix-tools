'use strict';

import * as sls from '../../akkasls';
import * as base from './projectBaseTreeItem';
import * as credential from '../../datatypes/docker/listcredentials';
import * as vscode from 'vscode';
import { aslogger } from '../../utils/logger';
import * as table from 'cli-table3';

export const ITEM_TYPE = 'Credentials';

export class DockerTreeItem extends base.TreeItem {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly credential: credential.ListCredentials,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, ITEM_TYPE);
    }

    getName(): string {
        let elems = this.credential.name.split('/');
        return elems[elems.length-1];
    }

    description = this.credential.server;

    getIcon(): vscode.ThemeIcon {
        return new vscode.ThemeIcon('lock');
    }

    id = this.getName();

    iconPath = this.getIcon();

    contextValue = ITEM_TYPE;

    printDetails() {
        if (this.label !== ITEM_TYPE) {
            let printTable = new table({});
            printTable.push(['Name', this.getName()]);
            printTable.push(['Server', this.credential.server]);
            printTable.push(['Username', this.credential.username]);
            aslogger.log(printTable.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
        }
    }
}

export async function getDockerTreeItems(parentProjectID: string, akkasls: sls.AkkaServerless): Promise<DockerTreeItem[]> {
    let items: DockerTreeItem[] = [];

    let credentialList = await akkasls.getDockerCredentials(parentProjectID);

    for (let credential of credentialList) {
        items.push(new DockerTreeItem(credential.server, parentProjectID, credential, vscode.TreeItemCollapsibleState.None));
    }

    return items;
}

export function getDefaultDockerTreeItem(parentProjectID: string): DockerTreeItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new DockerTreeItem(ITEM_TYPE, parentProjectID,{ name: `${parentProjectID}-${ITEM_TYPE}`, server: '', username: ''}, vscode.TreeItemCollapsibleState.Collapsed);
}