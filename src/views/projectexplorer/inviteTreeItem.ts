'use strict'

import * as sls from '../../akkasls';
import * as base from './baseTreeItem';
import * as invite from '../../datatypes/invite';
import * as vscode from 'vscode';
import { aslogger } from '../../utils/logger';

const Table = require('cli-table');

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
        return this.invite.name
    }

    getRoleID(): string {
        return this.invite.role_id
    }

    getEmail(): string {
        return this.invite.email
    }

    getDateCreated(): number {
        return this.invite.created.seconds
    }

    getIcon(): vscode.ThemeIcon {
        if (this.label == ITEM_TYPE) {
            return new vscode.ThemeIcon('account')
        }
        return new vscode.ThemeIcon('call-outgoing')
    }

    id = this.getName()

    iconPath = this.getIcon()

    contextValue = ITEM_TYPE

    printDetails() {
        if (this.label != ITEM_TYPE) {
            const table = new Table({})
            table.push(['Email address',this.invite.email])
            table.push(['Invited as',this.invite.role_id])
            table.push(['Invited on',new Date(this.invite.created.seconds * 1000).toLocaleDateString()])
            aslogger.log(table.toString())
        }
    }
}

export async function Get(parentProjectID: string, akkasls: sls.AkkaServerless): Promise<InviteTreeItem[]> {
    let invites: InviteTreeItem[] = []

    let invitesList = await akkasls.getInvitesByProject(parentProjectID)

    for (let invite of invitesList) {
        invites.push(new InviteTreeItem(invite.email, parentProjectID, invite, vscode.TreeItemCollapsibleState.None))
    }

    return invites;
}

export function DefaultItem(parentProjectID: string): InviteTreeItem {
    return new InviteTreeItem(ITEM_TYPE, parentProjectID, {name: `${parentProjectID}-${ITEM_TYPE}`, role_id: '', email: '', created: {seconds: 0}}, vscode.TreeItemCollapsibleState.Collapsed)
}