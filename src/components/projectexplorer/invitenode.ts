import * as vscode from 'vscode';
import { logger } from '../../utils/logger';
import { ProjectExplorerNode } from './projectexplorernode';
import { table } from 'table';
import { INVITE_ITEM_TYPE } from '../../utils/constants';
import { Convert, Invite } from '../akkasls/api';
import { listInvites } from '../akkasls/roles/listInvites';
import { getConfiguration } from '../../utils/config';

/**
 * The InviteNode is a node that captures the information of invitations sent to other users
 *
 * @class InviteNode
 * @extends {ProjectNode}
 */
export class InviteNode extends ProjectExplorerNode {
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

    print(): void {
        if (this.label !== INVITE_ITEM_TYPE) {
            const printTable = [];
            printTable.push(['Email address', this.invite.email]);
            printTable.push(['Invited as', this.invite.role_id]);
            printTable.push(['Invited on', new Date(this.invite.created.seconds * 1000).toLocaleDateString()]);
            logger.log(table(printTable), `Invitation details for: ${this.getName()}`);
        }
    }
}

/**
 * The getInvites command retrieves all current outstanding invites for a single project
 * based on the projectID
 *
 * @param {string} parentProjectID
 * @return {*}  {(Promise<InviteNode[]>)}
 */
export async function getInvites(parentProjectID: string): Promise<InviteNode[]> {
    const invites: InviteNode[] = [];

    const result = await listInvites(parentProjectID, getConfiguration());

    if (result.code !== undefined) {
        vscode.window.showErrorMessage(`Unable to obtain invites: ${result.stderr}`);
        return invites;
    }

    const invitesList = Convert.toInvite(result.stdout!);

    for (const invite of invitesList) {
        invites.push(new InviteNode(invite.email, parentProjectID, invite, vscode.TreeItemCollapsibleState.None));
    }

    return invites;
}

/**
 * The getInvitePlaceholder creates a placeholder that can be shown in the tree for Invite
 * nodes
 *
 * @param {string} parentProjectID
 * @return {*}  {InviteNode}
 */
export function getInvitePlaceholder(parentProjectID: string): InviteNode {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new InviteNode(INVITE_ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${INVITE_ITEM_TYPE}`, role_id: '', email: '', created: { seconds: 0 } }, vscode.TreeItemCollapsibleState.Collapsed);
}