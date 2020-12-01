'use strict';

import { AkkaServerless, CONSOLE_URL } from '../../akkasls';
import { ProjectBaseTreeItem } from './projectBaseTreeItem';
import { INVITE_ITEM_TYPE, InviteTreeItem, GetInviteTreeItems, GetDefaultInviteTreeItem } from './inviteTreeItem';
import { MEMBER_ITEM_TYPE, GetMemberTreeItems, GetDefaultMemberTreeItem } from './memberTreeItem';
import { SERVICE_ITEM_TYPE, ServiceTreeItem, GetServiceTreeItems, GetDefaultServiceTreeItem } from './serviceTreeItem';
import { PROJECT_ITEM_TYPE, GetProjectTreeItems } from './projectTreeItem';
import { DOCKER_ITEM_TYPE, DockerTreeItem, GetDockerTreeItems, GetDefaultDockerTreeItem } from './dockerTreeItem';
import { TreeDataProvider, EventEmitter, Event, TreeItem, Uri, commands } from 'vscode';

export class ProjectExplorer implements TreeDataProvider<ProjectBaseTreeItem> {
    private _onDidChangeTreeData: EventEmitter<ProjectBaseTreeItem | undefined | void> = new EventEmitter<ProjectBaseTreeItem | undefined | void>();
    readonly onDidChangeTreeData: Event<ProjectBaseTreeItem | undefined | void> = this._onDidChangeTreeData.event;
    private akkaServerless: AkkaServerless;

    constructor(akkaServerless: AkkaServerless) {
        this.akkaServerless = akkaServerless;
        akkaServerless.registerProjectExplorer(this);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ProjectBaseTreeItem): TreeItem {
        return element;
    }

    getChildren(element?: ProjectBaseTreeItem): Thenable<ProjectBaseTreeItem[]> {
        if (element) {
            switch (element.type) {
                case PROJECT_ITEM_TYPE:
                    return Promise.resolve(this.getDefaultProjectItems(element.id!));
                case SERVICE_ITEM_TYPE:
                    return Promise.resolve(GetServiceTreeItems(element.parentProjectID, this.akkaServerless));
                case MEMBER_ITEM_TYPE:
                    return Promise.resolve(GetMemberTreeItems(element.parentProjectID, this.akkaServerless));
                case INVITE_ITEM_TYPE:
                    return Promise.resolve(GetInviteTreeItems(element.parentProjectID, this.akkaServerless));
                case DOCKER_ITEM_TYPE:
                    return Promise.resolve(GetDockerTreeItems(element.parentProjectID, this.akkaServerless));
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(GetProjectTreeItems(this.akkaServerless));
    }

    getDefaultProjectItems(parentProjectID: string): Promise<ProjectBaseTreeItem[]> {
        let defaultTreeItems: ProjectBaseTreeItem[] = [];
        defaultTreeItems.push(GetDefaultServiceTreeItem(parentProjectID));
        defaultTreeItems.push(GetDefaultDockerTreeItem(parentProjectID));
        defaultTreeItems.push(GetDefaultMemberTreeItem(parentProjectID));
        defaultTreeItems.push(GetDefaultInviteTreeItem(parentProjectID));
        return Promise.resolve(defaultTreeItems);
    }

    async deployService(item: ProjectBaseTreeItem) {
        this.akkaServerless.deployService(item.parentProjectID);
    }

    async addDockerCredentials(item: ProjectBaseTreeItem) {
        this.akkaServerless.addDockerCredentials(item.parentProjectID);
    }

    async deleteDockerCredentials(item: DockerTreeItem) {
        if (item.label !== DOCKER_ITEM_TYPE) {
            this.akkaServerless.deleteDockerCredentials(item.parentProjectID, item.label);
        }
    }

    async undeployService(item: ServiceTreeItem) {
        if (item.label !== SERVICE_ITEM_TYPE) {
            this.akkaServerless.undeployService(item.parentProjectID, item.label);
        }
    }

    async exposeService(item: ServiceTreeItem) {
        if (item.label !== SERVICE_ITEM_TYPE) {
            this.akkaServerless.exposeService(item.parentProjectID, item.label);
        }
    }

    async unexposeService(item: ServiceTreeItem) {
        if (item.label !== SERVICE_ITEM_TYPE) {
            this.akkaServerless.unexposeService(item.parentProjectID, item.label);
        }
    }

    async inviteUser(base: ProjectBaseTreeItem) {
        this.akkaServerless.inviteUser(base.parentProjectID);
    }

    async deleteInvite(item: InviteTreeItem) {
        this.akkaServerless.deleteInvite(item.parentProjectID, item.invite.email);
    }

    async newProject() {
        this.akkaServerless.createNewProject();
    }

    async printTreeItemDetails(base: ProjectBaseTreeItem) {
        base.printDetails();
    }

    async openTreeItemInBrowser(base: ProjectBaseTreeItem) {
        let url: string = '';
    
        switch (base.type) {
            case PROJECT_ITEM_TYPE:
                url = `${CONSOLE_URL}/project/${base.id}/overview`;
                break;
            case SERVICE_ITEM_TYPE:
                if (base.id?.includes('-Services')) {
                    url = `${CONSOLE_URL}/project/${base.id.substring(0, base.id.length - 9)}/services`;
                } else {
                    url = `${CONSOLE_URL}/project/${base.parentProjectID}/service/${base.id}`;
                }
                break;
            case MEMBER_ITEM_TYPE:
                url = `${CONSOLE_URL}/project/${base.parentProjectID}/members`;
                break;
            case INVITE_ITEM_TYPE:
                url = `${CONSOLE_URL}/project/${base.parentProjectID}/members`;
                break;
            default:
                break;
        }
    
        commands.executeCommand('open', Uri.parse(url));
    }
}