import { Credential } from '@retgits/akkasls-nodewrapper';
import { QuickPickItem, window } from 'vscode';

export async function dockerCredentialsPicker(credentials: Credential[]): Promise<string> {
    const credentialPickItems: QuickPickItem[] = credentials.map(credential => ({label: credential.server}));
    const credentialPick = await window.showQuickPick(credentialPickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: 'pick a credential to remove...'
    });

    if (credentialPick?.label) {
        return getCredentialIDByServer(credentialPick.label, credentials);
    }

    throw new Error('No docker credentials selected');
}

function getCredentialIDByServer(server: string, credentials: Credential[]): string {
    let credentialID = '';
    credentials.forEach((credential) => {
        if (credential.server === server) {
            const elems = credential.name.split('/');
            credentialID = elems[elems.length-1];
        }
    });
    return credentialID;
}