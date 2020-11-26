'use strict';

import * as sls from '../../akkasls';
import * as base from './baseTreeItem';
import * as invite from './inviteTreeItem';
import * as member from './memberTreeItem';
import * as service from './serviceTreeItem';
import * as project from './projectTreeItem';
import * as vscode from 'vscode';

export class ProjectExplorer implements vscode.TreeDataProvider<base.TreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<base.TreeItem | undefined | void> = new vscode.EventEmitter<base.TreeItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<base.TreeItem | undefined | void> = this._onDidChangeTreeData.event;
    private akkaServerless: sls.AkkaServerless;

    constructor(akkaServerless: sls.AkkaServerless) {
        this.akkaServerless = akkaServerless;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: base.TreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: base.TreeItem): Thenable<base.TreeItem[]> {
        if (element) {
            switch (element.type) {
                case project.ITEM_TYPE:
                    return Promise.resolve(this.getDefaultProjectItems(element.id!));
                case service.ITEM_TYPE:
                    return Promise.resolve(service.getServiceTreeItems(element.parentProjectID, this.akkaServerless));
                case member.ITEM_TYPE:
                    return Promise.resolve(member.getMemberTreeItems(element.parentProjectID, this.akkaServerless));
                case invite.ITEM_TYPE:
                    return Promise.resolve(invite.getInviteTreeItems(element.parentProjectID, this.akkaServerless));
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(project.getProjectTreeItems(this.akkaServerless));
    }

    getDefaultProjectItems(parentProjectID: string): Promise<base.TreeItem[]> {
        let defaultTreeItems: base.TreeItem[] = [];
        defaultTreeItems.push(service.getDefaultServiceTreeItem(parentProjectID));
        defaultTreeItems.push(member.getDefaultMemberTreeItem(parentProjectID));
        defaultTreeItems.push(invite.getDefaultInviteTreeItem(parentProjectID));
        return Promise.resolve(defaultTreeItems);
    }

    async deployService(item: base.TreeItem) {
        this.akkaServerless.deployService(item.parentProjectID);
        this.refresh();
    }

    async undeployService(item: service.ServiceTreeItem) {
        if (item.label !== service.ITEM_TYPE) {
            this.akkaServerless.undeployService(item.parentProjectID, item.label);
            this.refresh();
        }
    }

    async exposeService(item: service.ServiceTreeItem) {
        if (item.label !== service.ITEM_TYPE) {
            this.akkaServerless.exposeService(item.parentProjectID, item.label);
            this.refresh();
        }
    }

    async unexposeService(item: service.ServiceTreeItem) {
        if (item.label !== service.ITEM_TYPE) {
            this.akkaServerless.unexposeService(item.parentProjectID, item.label);
            this.refresh();
        }
    }

    async inviteUser(base: base.TreeItem) {
        this.akkaServerless.inviteUser(base.parentProjectID);
        this.refresh();
    }

    async newProject() {
        this.akkaServerless.createNewProject();
        this.refresh();
    }

    async printTreeItemDetails(base: base.TreeItem) {
        base.printDetails();
    }

    async openTreeItemInBrowser(base: base.TreeItem) {
        let url: string = '';
    
        switch (base.type) {
            case project.ITEM_TYPE:
                url = `${sls.CONSOLE_URL}/project/${base.id}/overview`;
                break;
            case service.ITEM_TYPE:
                if (base.id?.includes('-Services')) {
                    url = `${sls.CONSOLE_URL}/project/${base.id.substring(0, base.id.length - 9)}/services`;
                } else {
                    url = `${sls.CONSOLE_URL}/project/${base.parentProjectID}/service/${base.id}`;
                }
                break;
            case member.ITEM_TYPE:
                url = `${sls.CONSOLE_URL}/project/${base.parentProjectID}/members`;
                break;
            case invite.ITEM_TYPE:
                url = `${sls.CONSOLE_URL}/project/${base.parentProjectID}/members`;
                break;
            default:
                break;
        }
    
        vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
    }
}