import { Function } from '../local/serverlesstemplate';
import { QuickPickItem, window } from 'vscode';

// eslint-disable-next-line @typescript-eslint/ban-types
export async function functionPicker(title: string, funcs: Function[]): Promise<string> {
    const functionPickItems: QuickPickItem[] = funcs.map(funcs => ({label: funcs.name}));
    const functionPick = await window.showQuickPick(functionPickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: title
    });

    if (functionPick?.label) {
        return functionPick.label;
    }

    throw new Error('No function selected');
}