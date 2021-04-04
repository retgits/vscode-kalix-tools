// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// External dependencies
import * as table from 'cli-table3';

// Internal dependencies
import { Credential, listDockerCredentials } from '../cli/docker/docker';
import { Invite, listInvites, Member, listMembers } from '../cli/roles/roles';
import { Project, listProjects } from '../cli/project/project';
import { Service, listServices } from '../cli/service/service';
import { getCurrentCommandConfig } from '../cli/commands';
import { logger } from '../../logger';

const DOCKER_ITEM_TYPE = 'Credentials';
const INVITE_ITEM_TYPE = 'Invites';
const MEMBER_ITEM_TYPE = 'Members';
const PROJECT_ITEM_TYPE = 'Projects';
const SERVICE_ITEM_TYPE = 'Services';

/**
 * The BaseProjectNode is the base node for all project explorer nodes
 *
 * @class BaseProjectNode
 * @extends {vscode.TreeItem}
 */
export abstract class BaseProjectNode extends vscode.TreeItem {
    public readonly type: string;
    public readonly parentProjectID: string;

    constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState, type: string, parentProjectID?: string) {
        super(label, collapsibleState);
        this.type = type;
        this.parentProjectID = (parentProjectID) ? parentProjectID : 'none';
    }

    abstract printDetails(): void;
}

/**
 *
 *
 * @export
 * @class ContainerCredentialNode
 * @extends {BaseProjectNode}
 */
class ContainerCredentialNode extends BaseProjectNode {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly credential: Credential,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, DOCKER_ITEM_TYPE);
    }

    getName(): string {
        const elems = this.credential.name.split('/');
        return elems[elems.length - 1];
    }

    description = this.credential.server;

    id = this.getName();

    iconPath = new vscode.ThemeIcon('lock');

    contextValue = DOCKER_ITEM_TYPE;

    printDetails(): void {
        if (this.label !== DOCKER_ITEM_TYPE) {
            const printTable = new table({});
            printTable.push(['Name', this.getName()]);
            printTable.push(['Server', this.credential.server]);
            printTable.push(['Username', this.credential.username]);
            logger.log(printTable.toString());
        }
    }
}

async function getContainerCredentialItems(parentProjectID: string): Promise<ContainerCredentialNode[] | undefined> {
    const items: ContainerCredentialNode[] = [];

    const creds = await listDockerCredentials(parentProjectID, getCurrentCommandConfig());

    if (creds === undefined) {
        return undefined;
    }

    const credentialList = creds.response as Credential[];

    for (const credential of credentialList) {
        items.push(new ContainerCredentialNode(credential.server, parentProjectID, credential, vscode.TreeItemCollapsibleState.None));
    }

    return items;
}

function getDefaultDockerCredentialItem(parentProjectID: string): ContainerCredentialNode {
    return new ContainerCredentialNode(DOCKER_ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${DOCKER_ITEM_TYPE}`, server: '', username: '' }, vscode.TreeItemCollapsibleState.Collapsed);
}

class InviteNode extends BaseProjectNode {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly invite: Invite,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, INVITE_ITEM_TYPE);
    }

    getName(): string {
        return this.invite.name;
    }

    getRoleID(): string {
        return this.invite.role_id;
    }

    getEmail(): string {
        return this.invite.email;
    }

    getDateCreated(): number {
        return this.invite.created.seconds;
    }

    getIcon(): vscode.ThemeIcon {
        if (this.label === INVITE_ITEM_TYPE) {
            return new vscode.ThemeIcon('account');
        }
        return new vscode.ThemeIcon('call-outgoing');
    }

    id = this.getName();

    iconPath = this.getIcon();

    contextValue = INVITE_ITEM_TYPE;

    printDetails(): void {
        if (this.label !== INVITE_ITEM_TYPE) {
            const printTable = new table({});
            printTable.push(['Email address', this.invite.email]);
            printTable.push(['Invited as', this.invite.role_id]);
            printTable.push(['Invited on', new Date(this.invite.created.seconds * 1000).toLocaleDateString()]);
            logger.log(printTable.toString());
        }
    }
}

async function getInviteItems(parentProjectID: string): Promise<InviteNode[] | undefined> {
    const invites: InviteNode[] = [];

    const result = await listInvites(parentProjectID, getCurrentCommandConfig());

    if (result === undefined) {
        return undefined;
    }

    const invitesList = result.response as Invite[];

    for (const invite of invitesList) {
        invites.push(new InviteNode(invite.email, parentProjectID, invite, vscode.TreeItemCollapsibleState.None));
    }

    return invites;
}

function getDefaultInviteItem(parentProjectID: string): InviteNode {
    // eslint-disable-next-line camelcase
    return new InviteNode(INVITE_ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${INVITE_ITEM_TYPE}`, role_id: '', email: '', created: { seconds: 0 } }, vscode.TreeItemCollapsibleState.Collapsed);
}

class MemberNode extends BaseProjectNode {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly member: Member,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, MEMBER_ITEM_TYPE);
    }

    getName(): string {
        return this.member.name;
    }

    getUserName(): string {
        return this.member.user_name;
    }

    getEmail(): string {
        return this.member.user_email;
    }

    getFullName(): string {
        return this.member.user_full_name;
    }

    getUserFriendlyName(): string {
        return this.member.user_friendly_name;
    }

    getIcon(): vscode.ThemeIcon {
        if (this.label === MEMBER_ITEM_TYPE) {
            return new vscode.ThemeIcon('organization');
        }
        return new vscode.ThemeIcon('person');
    }

    id = this.getName();

    iconPath = this.getIcon();

    contextValue = MEMBER_ITEM_TYPE;

    printDetails(): void {
        if (this.label !== MEMBER_ITEM_TYPE) {
            const printTable = new table({});
            printTable.push(['Name', this.member.user_full_name]);
            printTable.push(['Email address', this.member.user_email]);
            logger.log(printTable.toString());
        }
    }
}

async function getMemberItems(parentProjectID: string): Promise<MemberNode[] | undefined> {
    const members: MemberNode[] = [];

    const result = await listMembers(parentProjectID, getCurrentCommandConfig());

    if (result === undefined) {
        return undefined;
    }

    const membersList = result.response as Member[];

    for (const member of membersList) {
        members.push(new MemberNode(member.user_full_name, parentProjectID, member, vscode.TreeItemCollapsibleState.None));
    }

    return members;
}

export function getDefaultMemberItem(parentProjectID: string): MemberNode {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    // eslint-disable-next-line camelcase
    return new MemberNode(MEMBER_ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${MEMBER_ITEM_TYPE}`, user_name: '', user_email: '', user_full_name: '', user_friendly_name: '' }, vscode.TreeItemCollapsibleState.Collapsed);
}

class ProjectNode extends BaseProjectNode {
    constructor(
        public readonly label: string,
        public readonly project: Project,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, PROJECT_ITEM_TYPE);
    }

    getName(): string {
        return this.project.name;
    }

    getStatus(): string {
        if (this.project.status === 1) {
            return 'pending';
        }
        return 'active';
    }

    id = this.getName().substring(9);

    tooltip = this.getStatus();

    contextValue = PROJECT_ITEM_TYPE;

    iconPath = new vscode.ThemeIcon('project');

    printDetails(): void {
        if (this.label !== PROJECT_ITEM_TYPE) {
            const printTable = new table({});
            printTable.push(['Name', this.project.friendly_name]);
            if (this.project.description) {
                printTable.push(['Description', this.project.description]);
            }
            printTable.push(['Status', this.getStatus()]);
            if (this.project.hostnames) {
                const names: string[] = [];
                for (const hostname of this.project.hostnames) {
                    names.push(hostname.name);
                }
                printTable.push(['Hostnames', names.join('\n')]);
            }
            logger.log(printTable.toString());
        }
    }
}

async function getProjectItems(): Promise<ProjectNode[] | undefined> {
    const projects: ProjectNode[] = [];

    const result = await listProjects(getCurrentCommandConfig());

    if (result === undefined) {
        return undefined;
    }

    const projectList = result.response as Project[];

    for (const project of projectList) {
        projects.push(new ProjectNode(project.friendly_name, project, vscode.TreeItemCollapsibleState.Collapsed));
    }

    return projects;
}

class ServiceNode extends BaseProjectNode {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly service: Service,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, SERVICE_ITEM_TYPE);
    }

    getUID(): string {
        return this.service.metadata.uid;
    }

    getIcon(): vscode.ThemeIcon {
        if (this.label === SERVICE_ITEM_TYPE) {
            return new vscode.ThemeIcon('cloud');
        }
        return new vscode.ThemeIcon('cloud-upload');
    }

    id = this.getUID();

    iconPath = this.getIcon();

    contextValue = SERVICE_ITEM_TYPE;

    printDetails(): void {
        if (this.label !== SERVICE_ITEM_TYPE) {
            const printTable = new table({
                head: ['Item', 'Description']
            });
            printTable.push(['Name', this.service.metadata.name]);
            printTable.push(['Status', this.service.status?.summary]);
            printTable.push(['Created on', new Date(this.service.metadata.creationTimestamp!).toLocaleString()]);
            printTable.push(['Generation', this.service.metadata.generation]);
            if (this.service.spec?.containers) {
                const containers: string[] = [];
                for (const container of this.service.spec.containers) {
                    containers.push(container.image!);
                }
                printTable.push(['Container images', containers.join('\n')]);
            }
            printTable.push(['Replicas', this.service.spec?.replicas]);
            logger.log(printTable.toString());
        }
    }
}

async function getServiceItems(parentProjectID: string): Promise<ServiceNode[] | undefined> {
    const services: ServiceNode[] = [];

    const result = await listServices(parentProjectID, getCurrentCommandConfig());

    if (result === undefined) {
        return undefined;
    }

    const servicesList = result.response as Service[];

    for (const service of servicesList) {
        services.push(new ServiceNode(service.metadata.name, parentProjectID, service, vscode.TreeItemCollapsibleState.None));
    }

    return services;
}

export function getDefaultServiceItem(parentProjectID: string): ServiceNode {
    return new ServiceNode(SERVICE_ITEM_TYPE, parentProjectID, { metadata: { name: '', uid: `${parentProjectID}-${SERVICE_ITEM_TYPE}` } }, vscode.TreeItemCollapsibleState.Collapsed);
}

export class ProjectExplorer implements vscode.TreeDataProvider<BaseProjectNode> {
    private _onDidChangeTreeData: vscode.EventEmitter<BaseProjectNode | undefined | void> = new vscode.EventEmitter<BaseProjectNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<BaseProjectNode | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: BaseProjectNode): vscode.TreeItem {
        return element;
    }

    getChildren(element?: BaseProjectNode): Thenable<BaseProjectNode[] | undefined> {
        if (element) {
            switch (element.type) {
                case PROJECT_ITEM_TYPE:
                    return Promise.resolve(this.getDefaultProjectItems(element.id!));
                case SERVICE_ITEM_TYPE:
                    return Promise.resolve(getServiceItems(element.parentProjectID));
                case MEMBER_ITEM_TYPE:
                    return Promise.resolve(getMemberItems(element.parentProjectID));
                case INVITE_ITEM_TYPE:
                    return Promise.resolve(getInviteItems(element.parentProjectID));
                case DOCKER_ITEM_TYPE:
                    return Promise.resolve(getContainerCredentialItems(element.parentProjectID));
                default:
                    break;
            }
            return Promise.resolve([]);
        }

        // if there is no element present, get all projects and populate a new tree
        return Promise.resolve(getProjectItems());
    }

    getDefaultProjectItems(parentProjectID: string): Promise<BaseProjectNode[]> {
        const defaultTreeItems: BaseProjectNode[] = [];
        defaultTreeItems.push(getDefaultServiceItem(parentProjectID));
        defaultTreeItems.push(getDefaultDockerCredentialItem(parentProjectID));
        defaultTreeItems.push(getDefaultMemberItem(parentProjectID));
        defaultTreeItems.push(getDefaultInviteItem(parentProjectID));
        return Promise.resolve(defaultTreeItems);
    }

    async printTreeItemDetails(base: BaseProjectNode): Promise<void> {
        base.printDetails();
    }
}