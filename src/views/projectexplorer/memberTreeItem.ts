'use strict';

import * as sls from '../../akkasls';
import * as base from './projectBaseTreeItem';
import * as member from '../../datatypes/roles/member';
import * as vscode from 'vscode';
import { aslogger } from '../../utils/logger';
import * as table from 'cli-table3';

export const ITEM_TYPE = 'Members';

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
        if (this.label === ITEM_TYPE) {
            return new vscode.ThemeIcon('organization');
        }
        return new vscode.ThemeIcon('person');
    }

    id = this.getName();

    iconPath = this.getIcon();

    contextValue = ITEM_TYPE;

    printDetails() {
        if (this.label !== ITEM_TYPE) {
            let printTable = new table({});
            printTable.push(['Name', this.member.user_full_name]);
            printTable.push(['Email address', this.member.user_email]);
            aslogger.log(printTable.toString());
        }
    }
}

export async function getMemberTreeItems(parentProjectID: string, akkasls: sls.AkkaServerless): Promise<MemberTreeItem[]> {
    let members: MemberTreeItem[] = [];

    let membersList = await akkasls.getMembers(parentProjectID);

    for (let member of membersList) {
        members.push(new MemberTreeItem(member.user_full_name, parentProjectID, member, vscode.TreeItemCollapsibleState.None));
    }

    return members;
}

export function getDefaultMemberTreeItem(parentProjectID: string): MemberTreeItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new MemberTreeItem(ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${ITEM_TYPE}`, user_name: '', user_email: '', user_full_name: '', user_friendly_name: '' }, vscode.TreeItemCollapsibleState.Collapsed);
}