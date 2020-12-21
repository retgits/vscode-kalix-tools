import { window } from 'vscode';

export async function inputBox(placeholder: string, prompt: string): Promise<string> {
    const result = await window.showInputBox({
        ignoreFocusOut: true,
        password: false,
        placeHolder: placeholder,
        prompt: prompt,
    });

    if (!result) {
        throw new Error(`No input provided for ${prompt}`);
    }

    return result;
}