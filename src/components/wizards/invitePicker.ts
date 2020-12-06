import { Invite } from '../../akkasls/datatypes/roles/invitations/invite';
import { QuickPickItem, window } from 'vscode';

export async function invitePicker(title: string, invites: Invite[]): Promise<string> {
    let invitePickItems: QuickPickItem[] = invites.map(invites => ({label: invites.email}));
    let invitePick = await window.showQuickPick(invitePickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: title
    });

    return invitePick!.label;
}