'use strict';

import * as sls from '../../akkasls';
import * as base from './projectBaseTreeItem';
import * as invite from '../../datatypes/roles/invitations/invite';
import * as vscode from 'vscode';
import { aslogger } from '../../utils/logger';
import * as table from 'cli-table3';

export const ITEM_TYPE = 'Invites';

export class InviteTreeItem extends base.TreeItem {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly invite: invite.Invite,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, ITEM_TYPE);
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
        if (this.label === ITEM_TYPE) {
            return new vscode.ThemeIcon('account');
        }
        return new vscode.ThemeIcon('call-outgoing');
    }

    id = this.getName();

    iconPath = this.getIcon();

    contextValue = ITEM_TYPE;

    printDetails() {
        if (this.label !== ITEM_TYPE) {
            let printTable = new table({});
            printTable.push(['Email address', this.invite.email]);
            printTable.push(['Invited as', this.invite.role_id]);
            printTable.push(['Invited on', new Date(this.invite.created.seconds * 1000).toLocaleDateString()]);
            aslogger.log(printTable.toString());
        }
    }
}

export async function getInviteTreeItems(parentProjectID: string, akkasls: sls.AkkaServerless): Promise<InviteTreeItem[]> {
    let invites: InviteTreeItem[] = [];

    let invitesList = await akkasls.getInvites(parentProjectID);

    for (let invite of invitesList) {
        invites.push(new InviteTreeItem(invite.email, parentProjectID, invite, vscode.TreeItemCollapsibleState.None));
    }

    return invites;
}

export function getDefaultInviteTreeItem(parentProjectID: string): InviteTreeItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new InviteTreeItem(ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${ITEM_TYPE}`, role_id: '', email: '', created: { seconds: 0 } }, vscode.TreeItemCollapsibleState.Collapsed);
}