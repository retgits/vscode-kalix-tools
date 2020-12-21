import { Invite } from '@retgits/akkasls-nodewrapper';
import { QuickPickItem, window } from 'vscode';

export async function invitePicker(title: string, invites: Invite[]): Promise<string> {
    const invitePickItems: QuickPickItem[] = invites.map(invites => ({label: invites.email}));
    const invitePick = await window.showQuickPick(invitePickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: title
    });

    if (invitePick?.label) {
        return invitePick.label;
    }

    throw new Error('No invite selected');
}