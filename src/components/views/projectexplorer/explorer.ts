

import { AkkaServerless, CONSOLE_URL } from '../../../akkasls';
import { ProjectBaseTreeItem } from './projectBaseTreeItem';
import { INVITE_ITEM_TYPE, getInviteTreeItems, getDefaultInviteTreeItem } from './inviteTreeItem';
import { MEMBER_ITEM_TYPE, getMemberTreeItems, getDefaultMemberTreeItem } from './memberTreeItem';
import { SERVICE_ITEM_TYPE, getServiceTreeItems, getDefaultServiceTreeItem } from './serviceTreeItem';
import { PROJECT_ITEM_TYPE, getProjectTreeItems } from './projectTreeItem';
import { DOCKER_ITEM_TYPE, getDockerTreeItems, getDefaultDockerTreeItem } from './dockerTreeItem';
import { TreeDataProvider, EventEmitter, Event, TreeItem, Uri, commands } from 'vscode';

export class ProjectExplorer implements TreeDataProvider<ProjectBaseTreeItem> {
    private _onDidChangeTreeData: EventEmitter<ProjectBaseTreeItem | undefined | void> = new EventEmitter<ProjectBaseTreeItem | undefined | void>();
    readonly onDidChangeTreeData: Event<ProjectBaseTreeItem | undefined | void> = this._onDidChangeTreeData.event;
    private _akkasls: AkkaServerless;

    constructor(akkasls: AkkaServerless) {
        this._akkasls = akkasls;
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
                    return Promise.resolve(getServiceTreeItems(element.parentProjectID, this._akkasls));
                case MEMBER_ITEM_TYPE:
                    return Promise.resolve(getMemberTreeItems(element.parentProjectID, this._akkasls));
                case INVITE_ITEM_TYPE:
                    return Promise.resolve(getInviteTreeItems(element.parentProjectID, this._akkasls));
                case DOCKER_ITEM_TYPE:
                    return Promise.resolve(getDockerTreeItems(element.parentProjectID, this._akkasls));
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(getProjectTreeItems(this._akkasls));
    }

    getDefaultProjectItems(parentProjectID: string): Promise<ProjectBaseTreeItem[]> {
        let defaultTreeItems: ProjectBaseTreeItem[] = [];
        defaultTreeItems.push(getDefaultServiceTreeItem(parentProjectID));
        defaultTreeItems.push(getDefaultDockerTreeItem(parentProjectID));
        defaultTreeItems.push(getDefaultMemberTreeItem(parentProjectID));
        defaultTreeItems.push(getDefaultInviteTreeItem(parentProjectID));
        return Promise.resolve(defaultTreeItems);
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