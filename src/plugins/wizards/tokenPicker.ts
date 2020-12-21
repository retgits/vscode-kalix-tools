import { Token } from '@retgits/akkasls-nodewrapper';
import { QuickPickItem, window } from 'vscode';

export async function tokenPicker(title: string, tokens: Token[]): Promise<string> {
    const tokenPickItems: QuickPickItem[] = tokens.map((token) => {
        const tokenElements = token.name.split('/');
        return ({label: tokenElements[tokenElements.length-1]});
    });

    const tokenPick = await window.showQuickPick(tokenPickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: title
    });

    if (tokenPick?.label) {
        return tokenPick.label;
    }

    throw new Error('No token selected');
}