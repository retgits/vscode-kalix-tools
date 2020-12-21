

import { AkkaServerless } from '../../akkasls';
import { BaseProjectExplorerItem } from './baseProjectExplorerItem';
import { INVITE_ITEM_TYPE, getInviteItems, getDefaultInviteItem } from './inviteItem';
import { MEMBER_ITEM_TYPE, getMemberItems, getDefaultMemberItem } from './memberItem';
import { SERVICE_ITEM_TYPE, getServiceItems, getDefaultServiceItem } from './serviceItem';
import { PROJECT_ITEM_TYPE, getProjectItems } from './projectItem';
import { DOCKER_ITEM_TYPE, getDockerCredentialItems, getDefaultDockerCredentialItem } from './dockerCredentialItem';
import { TreeDataProvider, EventEmitter, Event, TreeItem, Uri, commands } from 'vscode';
import { config } from '../../config';

export class ProjectExplorer implements TreeDataProvider<BaseProjectExplorerItem> {
    private _onDidChangeTreeData: EventEmitter<BaseProjectExplorerItem | undefined | void> = new EventEmitter<BaseProjectExplorerItem | undefined | void>();
    readonly onDidChangeTreeData: Event<BaseProjectExplorerItem | undefined | void> = this._onDidChangeTreeData.event;
    private _akkasls: AkkaServerless;

    constructor(akkasls: AkkaServerless) {
        this._akkasls = akkasls;
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: BaseProjectExplorerItem): TreeItem {
        return element;
    }

    getChildren(element?: BaseProjectExplorerItem): Thenable<BaseProjectExplorerItem[]> {
        if (element) {
            switch (element.type) {
                case PROJECT_ITEM_TYPE:
                    return Promise.resolve(this.getDefaultProjectItems(element.id!));
                case SERVICE_ITEM_TYPE:
                    return Promise.resolve(getServiceItems(element.parentProjectID, this._akkasls));
                case MEMBER_ITEM_TYPE:
                    return Promise.resolve(getMemberItems(element.parentProjectID, this._akkasls));
                case INVITE_ITEM_TYPE:
                    return Promise.resolve(getInviteItems(element.parentProjectID, this._akkasls));
                case DOCKER_ITEM_TYPE:
                    return Promise.resolve(getDockerCredentialItems(element.parentProjectID, this._akkasls));
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(getProjectItems(this._akkasls));
    }

    getDefaultProjectItems(parentProjectID: string): Promise<BaseProjectExplorerItem[]> {
        const defaultTreeItems: BaseProjectExplorerItem[] = [];
        defaultTreeItems.push(getDefaultServiceItem(parentProjectID));
        defaultTreeItems.push(getDefaultDockerCredentialItem(parentProjectID));
        defaultTreeItems.push(getDefaultMemberItem(parentProjectID));
        defaultTreeItems.push(getDefaultInviteItem(parentProjectID));
        return Promise.resolve(defaultTreeItems);
    }

    async printTreeItemDetails(base: BaseProjectExplorerItem): Promise<void> {
        base.printDetails();
    }

    async openTreeItemInBrowser(base: BaseProjectExplorerItem): Promise<void> {
        let url = '';
    
        switch (base.type) {
            case PROJECT_ITEM_TYPE:
                url = `${config.consoleURL}/project/${base.id}/overview`;
                break;
            case SERVICE_ITEM_TYPE:
                if (base.id?.includes('-Services')) {
                    url = `${config.consoleURL}/project/${base.id.substring(0, base.id.length - 9)}/services`;
                } else {
                    url = `${config.consoleURL}/project/${base.parentProjectID}/service/${base.id}`;
                }
                break;
            case MEMBER_ITEM_TYPE:
                url = `${config.consoleURL}/project/${base.parentProjectID}/members`;
                break;
            case INVITE_ITEM_TYPE:
                url = `${config.consoleURL}/project/${base.parentProjectID}/members`;
                break;
            default:
                break;
        }
    
        commands.executeCommand('open', Uri.parse(url));
    }
}