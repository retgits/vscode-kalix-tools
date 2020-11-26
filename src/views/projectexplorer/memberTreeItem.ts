'use strict'

import * as sls from '../../akkasls';
import * as base from './baseTreeItem';
import * as member from '../../datatypes/roles/member';
import * as vscode from 'vscode';
import { aslogger } from '../../utils/logger';

const Table = require('cli-table');

export const ITEM_TYPE = 'Members'

export class MemberTreeItem extends base.TreeItem {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly member: member.Member,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, ITEM_TYPE);
    }

    getName(): string {
        return this.member.name
    }

    getUserName(): string {
        return this.member.user_name
    }

    getEmail(): string {
        return this.member.user_email
    }

    getFullName(): string {
        return this.member.user_full_name
    }

    getUserFriendlyName(): string {
        return this.member.user_friendly_name
    }

    getIcon(): vscode.ThemeIcon {
        if (this.label == ITEM_TYPE) {
            return new vscode.ThemeIcon('organization')
        }
        return new vscode.ThemeIcon('person')
    }

    id = this.getName()

    iconPath = this.getIcon()

    contextValue = ITEM_TYPE

    printDetails() {
        if (this.label != ITEM_TYPE) {
            const table = new Table({})
            table.push(['Name',this.member.user_full_name])
            table.push(['Email address',this.member.user_email])
            aslogger.log(table.toString())
        }
    }
}

export async function Get(parentProjectID: string, akkasls: sls.AkkaServerless): Promise<MemberTreeItem[]> {
    let members: MemberTreeItem[] = []

    let membersList = await akkasls.getMembers(parentProjectID);

    for (let member of membersList) {
        members.push(new MemberTreeItem(member.user_full_name, parentProjectID, member, vscode.TreeItemCollapsibleState.None))
    }

    return members;
}

export function DefaultItem(parentProjectID: string): MemberTreeItem {
    return new MemberTreeItem(ITEM_TYPE, parentProjectID, {name: `${parentProjectID}-${ITEM_TYPE}`, user_name: '', user_email: '', user_full_name: '', user_friendly_name: ''},vscode.TreeItemCollapsibleState.Collapsed)
}