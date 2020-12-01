'use strict';

import { AkkaServerless } from '../../akkasls';
import { ProjectBaseTreeItem } from './projectBaseTreeItem';
import { Invite } from '../../datatypes/roles/invitations/invite';
import { TreeItemCollapsibleState, ThemeIcon} from 'vscode';
import { aslogger } from '../../utils/logger';
import * as table from 'cli-table3';

export const INVITE_ITEM_TYPE = 'Invites';

export class InviteTreeItem extends ProjectBaseTreeItem {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly invite: Invite,
        public readonly collapsibleState: TreeItemCollapsibleState,
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

    getIcon(): ThemeIcon {
        if (this.label === INVITE_ITEM_TYPE) {
            return new ThemeIcon('account');
        }
        return new ThemeIcon('call-outgoing');
    }

    id = this.getName();

    iconPath = this.getIcon();

    contextValue = INVITE_ITEM_TYPE;

    printDetails() {
        if (this.label !== INVITE_ITEM_TYPE) {
            let printTable = new table({});
            printTable.push(['Email address', this.invite.email]);
            printTable.push(['Invited as', this.invite.role_id]);
            printTable.push(['Invited on', new Date(this.invite.created.seconds * 1000).toLocaleDateString()]);
            aslogger.log(printTable.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
        }
    }
}

export async function GetInviteTreeItems(parentProjectID: string, akkasls: AkkaServerless): Promise<InviteTreeItem[]> {
    let invites: InviteTreeItem[] = [];

    let invitesList = await akkasls.getInvites(parentProjectID);

    for (let invite of invitesList) {
        invites.push(new InviteTreeItem(invite.email, parentProjectID, invite, TreeItemCollapsibleState.None));
    }

    return invites;
}

export function GetDefaultInviteTreeItem(parentProjectID: string): InviteTreeItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new InviteTreeItem(INVITE_ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${INVITE_ITEM_TYPE}`, role_id: '', email: '', created: { seconds: 0 } }, TreeItemCollapsibleState.Collapsed);
}