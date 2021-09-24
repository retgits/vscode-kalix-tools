import * as vscode from 'vscode';
import { logger } from '../../utils/logger';
import { ProjectExplorerNode } from './projectexplorernode';
import { table } from 'table';
import { MEMBER_ITEM_TYPE } from '../../utils/constants';
import { Convert, Member } from '../akkasls/api';
import { listMembers } from '../akkasls/roles/listMembers';
import { getConfiguration } from '../../utils/config';

/**
 * The MemberNode is a node that captures the information of members of a project
 *
 * @class MemberNode
 * @extends {ProjectNode}
 */
export class MemberNode extends ProjectExplorerNode {
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

    print(): void {
        if (this.label !== MEMBER_ITEM_TYPE) {
            const printTable = [];
            printTable.push(['Name', this.member.user_full_name]);
            printTable.push(['Email address', this.member.user_email]);
            logger.log(table(printTable), `Member details for: ${this.label}`);
        }
    }
}

/**
 * The getMembers command retrieves all current members for a single project based on
 * the projectID
 *
 * @param {string} parentProjectID
 * @return {*}  {(Promise<MemberNode[]>)}
 */
export async function getMembers(parentProjectID: string): Promise<MemberNode[]> {
    const members: MemberNode[] = [];

    const result = await listMembers(parentProjectID, getConfiguration());

    if (result.code !== undefined) {
        vscode.window.showErrorMessage(`Unable to obtain members: ${result.stderr}`);
        return members;
    }

    const membersList = Convert.toMember(result.stdout!);

    for (const member of membersList) {
        members.push(new MemberNode(member.user_full_name, parentProjectID, member, vscode.TreeItemCollapsibleState.None));
    }

    return members;
}

/**
 * The getMemberPlaceholder creates a placeholder that can be shown in the tree for
 * Member nodes
 *
 * @param {string} parentProjectID
 * @return {*}  {MemberNode}
 */
export function getMemberPlaceholder(parentProjectID: string): MemberNode {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new MemberNode(MEMBER_ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${MEMBER_ITEM_TYPE}`, user_name: '', user_email: '', user_full_name: '', user_friendly_name: '' }, vscode.TreeItemCollapsibleState.Collapsed);
}