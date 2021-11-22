/*global Thenable*/
import { ProjectExplorerNode } from './projectexplorernode';
import * as vscode from 'vscode';
import { INVITE_ITEM_TYPE, MEMBER_ITEM_TYPE, PROJECT_ITEM_TYPE, REGISTRY_CREDENTIALS_ITEM_TYPE, SECRET_ITEM_TYPE, SERVICE_ITEM_TYPE } from '../../utils/constants';
import { getServicePlaceholder, getServices } from './servicenode';
import { getContainerRegistryCredentialPlaceholder, getContainerRegistryCredentials } from './containerregistrycredentialnode';
import { getMemberPlaceholder, getMembers } from './membernode';
import { getInvitePlaceholder, getInvites } from './invitenode';
import { getProjects } from './projectnode';
import { getSecrets, getSecretsPlaceholder } from './secretnode';

/**
 * The ProjectExplorer represents a tree of projects and related items that can be shown
 * and interacted with
 *
 * @export
 * @class ProjectExplorer
 * @implements {vscode.TreeDataProvider<ProjectExplorerNode>}
 */
export class ProjectExplorer implements vscode.TreeDataProvider<ProjectExplorerNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<ProjectExplorerNode | undefined | void> = new vscode.EventEmitter<ProjectExplorerNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<ProjectExplorerNode | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: ProjectExplorerNode): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ProjectExplorerNode): Thenable<ProjectExplorerNode[] | undefined> {
        if (element) {
            switch (element.type) {
                case PROJECT_ITEM_TYPE:
                    return Promise.resolve(this.getDefaultProjectItems(element.id!));
                case SERVICE_ITEM_TYPE:
                    return Promise.resolve(getServices(element.parentProjectID));
                case MEMBER_ITEM_TYPE:
                    return Promise.resolve(getMembers(element.parentProjectID));
                case INVITE_ITEM_TYPE:
                    return Promise.resolve(getInvites(element.parentProjectID));
                case REGISTRY_CREDENTIALS_ITEM_TYPE:
                    return Promise.resolve(getContainerRegistryCredentials(element.parentProjectID));
                case SECRET_ITEM_TYPE:
                    return Promise.resolve(getSecrets(element.parentProjectID));
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(getProjects());
    }

    getDefaultProjectItems(parentProjectID: string): Promise<ProjectExplorerNode[]> {
        const defaultTreeItems: ProjectExplorerNode[] = [];
        defaultTreeItems.push(getServicePlaceholder(parentProjectID));
        defaultTreeItems.push(getContainerRegistryCredentialPlaceholder(parentProjectID));
        defaultTreeItems.push(getMemberPlaceholder(parentProjectID));
        defaultTreeItems.push(getInvitePlaceholder(parentProjectID));
        defaultTreeItems.push(getSecretsPlaceholder(parentProjectID));
        return Promise.resolve(defaultTreeItems);
    }

    async print(base: ProjectExplorerNode): Promise<void> {
        base.print();
    }
}