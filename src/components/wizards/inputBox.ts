import { window } from 'vscode';

export async function inputBox(placeholder: string, prompt: string): Promise<string> {
    let result = await window.showInputBox({
        ignoreFocusOut: true,
        password: false,
        placeHolder: placeholder,
        prompt: prompt,
    });

    return result!;
}