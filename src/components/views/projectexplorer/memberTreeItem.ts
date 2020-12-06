import { AkkaServerless } from '../../../akkasls';
import { ProjectBaseTreeItem } from './projectBaseTreeItem';
import { Member } from '../../../akkasls/datatypes/roles/member';
import { TreeItemCollapsibleState, ThemeIcon} from 'vscode';
import { aslogger } from '../../../utils/logger';
import * as table from 'cli-table3';

export const MEMBER_ITEM_TYPE = 'Members';

export class MemberTreeItem extends ProjectBaseTreeItem {
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

    printDetails() {
        if (this.label !== MEMBER_ITEM_TYPE) {
            let printTable = new table({});
            printTable.push(['Name', this.member.user_full_name]);
            printTable.push(['Email address', this.member.user_email]);
            aslogger.log(printTable.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
        }
    }
}

export async function getMemberTreeItems(parentProjectID: string, akkasls: AkkaServerless): Promise<MemberTreeItem[]> {
    let members: MemberTreeItem[] = [];

    let membersList = await akkasls.listMembers(parentProjectID);

    for (let member of membersList) {
        members.push(new MemberTreeItem(member.user_full_name, parentProjectID, member, TreeItemCollapsibleState.None));
    }

    return members;
}

export function getDefaultMemberTreeItem(parentProjectID: string): MemberTreeItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new MemberTreeItem(MEMBER_ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${MEMBER_ITEM_TYPE}`, user_name: '', user_email: '', user_full_name: '', user_friendly_name: '' }, TreeItemCollapsibleState.Collapsed);
}