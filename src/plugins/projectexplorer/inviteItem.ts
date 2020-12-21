import { AkkaServerless } from '../../akkasls';
import { BaseProjectExplorerItem } from './baseProjectExplorerItem';
import { Invite } from '@retgits/akkasls-nodewrapper';
import { TreeItemCollapsibleState, ThemeIcon} from 'vscode';
import { logger } from '../../utils/logger';
import * as table from 'cli-table3';

export const INVITE_ITEM_TYPE = 'Invites';

export class InviteItem extends BaseProjectExplorerItem {
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

export async function getInviteItems(parentProjectID: string, akkasls: AkkaServerless): Promise<InviteItem[]> {
    const invites: InviteItem[] = [];

    const invitesList = await akkasls.listInvites(parentProjectID);

    for (const invite of invitesList) {
        invites.push(new InviteItem(invite.email, parentProjectID, invite, TreeItemCollapsibleState.None));
    }

    return invites;
}

export function getDefaultInviteItem(parentProjectID: string): InviteItem {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    return new InviteItem(INVITE_ITEM_TYPE, parentProjectID, { name: `${parentProjectID}-${INVITE_ITEM_TYPE}`, role_id: '', email: '', created: { seconds: 0 } }, TreeItemCollapsibleState.Collapsed);
}