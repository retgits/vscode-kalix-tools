import { AkkaServerless } from '../../akkasls';
import { BaseProjectExplorerItem } from './baseProjectExplorerItem';
import { Member } from '@retgits/akkasls-nodewrapper';
import { TreeItemCollapsibleState, ThemeIcon} from 'vscode';
import { logger } from '../../utils/logger';
import * as table from 'cli-table3';

export const MEMBER_ITEM_TYPE = 'Members';

export class MemberItem extends BaseProjectExplorerItem {
    constructor(
        public readonly label: string,
        public readonly parentProjectID: string,
        public readonly member: Member,
        public readonly collapsibleState: TreeItemCollapsibleState,
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

    getIcon(): ThemeIcon {
        if (this.label === MEMBER_ITEM_TYPE) {
            return new ThemeIcon('organization');
        }
        return new ThemeIcon('person');
    }

    id = this.getName();

    iconPath = this.getIcon();

    contextValue = MEMBER_ITEM_TYPE;

    printDetails(): void {
        if (this.label !== MEMBER_ITEM_TYPE) {
            const printTable = new table({});
            printTable.push(['Name', this.member.user_full_name]);
            printTable.push(['Email address', this.member.user_email]);
            logger.log(printTable.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
        }
    }
}

export async function getMemberItems(parentProjectID: string, akkasls: AkkaServerless): Promise<MemberItem[]> {
    const members: MemberItem[] = [];

    const membersList = await akkasls.listMembers(parentProjectID);

    for (const member of membersList) {
        members.push(new MemberItem(member.user_full_name, parentProjectID, member, TreeItemCollapsibleState.None));
    }

    return members;
}

export function getDefaultMemberItem(parentProjectID: string): MemberItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new MemberItem(MEMBER_ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${MEMBER_ITEM_TYPE}`, user_name: '', user_email: '', user_full_name: '', user_friendly_name: '' }, TreeItemCollapsibleState.Collapsed);
}