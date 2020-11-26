'use strict';

import * as sls from '../../akkasls';
import * as base from './baseTreeItem';
import * as invite from './inviteTreeItem';
import * as member from './memberTreeItem';
import * as service from './serviceTreeItem';
import * as project from './projectTreeItem';
import * as createProject from '../../cliwrapper/projects/new';
import * as userInvite from '../../cliwrapper/roles/invitations/inviteuser';
import * as deployService from '../../cliwrapper/services/deploy';
import * as exposeService from '../../cliwrapper/services/expose';
import * as undeployService from '../../cliwrapper/services/undeploy';
import * as unexposeService from '../../cliwrapper/services/unexpose';
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
}

export function printDetails(base: base.TreeItem) {
    base.printDetails();
}

export function openInBrowser(base: base.TreeItem) {
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

export async function newProject(projectExplorer: ProjectExplorer) {
    createProject.fromUI(projectExplorer);
}

export async function inviteUser(base: base.TreeItem, projectExplorer: ProjectExplorer) {
    userInvite.fromUI(base.parentProjectID, projectExplorer);
}

export async function deploy(item: base.TreeItem, projectExplorer: ProjectExplorer) {
    deployService.fromUI(item.parentProjectID, projectExplorer);
}

export async function undeploy(item: service.ServiceTreeItem, projectExplorer: ProjectExplorer) {
    if (item.label !== service.ITEM_TYPE) {
        undeployService.fromUI(item.parentProjectID, item.label, projectExplorer);
    }
}

export async function expose(item: service.ServiceTreeItem, projectExplorer: ProjectExplorer) {
    if (item.label !== service.ITEM_TYPE) {
        exposeService.fromUI(item.parentProjectID, item.label, projectExplorer);
    }
}

export async function unexpose(item: service.ServiceTreeItem, projectExplorer: ProjectExplorer) {
    if (item.label !== service.ITEM_TYPE) {
        unexposeService.fromUI(item.parentProjectID, item.label, projectExplorer);
    }
}