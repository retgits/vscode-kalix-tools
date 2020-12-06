import { Token } from '../../akkasls/datatypes/auth/tokens';
import { QuickPickItem, window } from 'vscode';

export async function tokenPicker(title: string, tokens: Token[]): Promise<string> {
    let tokenPickItems: QuickPickItem[] = tokens.map((token) => {
        let tokenElements = token.name.split('/');
        return ({label: tokenElements[tokenElements.length-1]});
    });
    let tokenPick = await window.showQuickPick(tokenPickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: title
    });

    return tokenPick!.label;
}