import { Service } from '../../akkasls/datatypes/services/service';
import { QuickPickItem, window } from 'vscode';

export async function servicePicker(title: string, services: Service[]): Promise<string> {
    let servicePickItems: QuickPickItem[] = services.map(service => ({label: service.metadata.name}));
    let servicePick = await window.showQuickPick(servicePickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: title
    });

    return servicePick!.label;
}