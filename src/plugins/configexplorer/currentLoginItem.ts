import { AkkaServerless } from '../../akkasls';
import { BaseConfigExplorerItem } from './baseConfigExplorerItem';
import { ThemeIcon, TreeItemCollapsibleState } from 'vscode';

export const LOGIN_ITEM_TYPE = 'CurrentLogin';

export class CurrentLoginItem extends BaseConfigExplorerItem {
    constructor(
        public readonly label: string,
        public readonly description: string,
        public readonly codicon: string,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, LOGIN_ITEM_TYPE);
    }

    iconPath = new ThemeIcon(this.codicon);

    tooltip = this.description;

    printDetails(): void {
        //
    }
}

export async function getCurrentLoginItem(akkasls: AkkaServerless): Promise<CurrentLoginItem[]> {
    const currentLogin = await akkasls.getCurrentLogin();
    const items: CurrentLoginItem[] = [];
    items.push(new CurrentLoginItem('user', currentLogin.user.fullName, 'account', TreeItemCollapsibleState.None));
    items.push(new CurrentLoginItem('email', currentLogin.user.email, 'mail', TreeItemCollapsibleState.None));
    items.push(new CurrentLoginItem('verified', `${currentLogin.user.email_verified}`, 'check', TreeItemCollapsibleState.None));
    return items;
}

export function getDefaultCurrentLoginItem(): CurrentLoginItem {
    return new CurrentLoginItem('Current login', '', 'account', TreeItemCollapsibleState.Collapsed);
}