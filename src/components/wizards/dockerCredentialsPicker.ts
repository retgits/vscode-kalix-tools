import { Credential } from '../../akkasls/datatypes/docker/credentials';
import { QuickPickItem, window } from 'vscode';

export async function dockerCredentialsPicker(credentials: Credential[]): Promise<string> {

    let credentialPickItems: QuickPickItem[] = credentials.map(credential => ({label: credential.server}));
    
    let credentialPick = await window.showQuickPick(credentialPickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: 'pick a credential to remove...'
    });

    return getCredentialIDByServer(credentialPick!.label, credentials);
}

function getCredentialIDByServer(server: string, credentials: Credential[]): string {
    let credentialID = '';
    credentials.forEach((credential) => {
        if (credential.server === server) {
            let elems = credential.name.split('/');
            credentialID = elems[elems.length-1];
        }
    });
    return credentialID;
}