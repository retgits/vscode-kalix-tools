import { Service } from '@retgits/akkasls-nodewrapper';
import { QuickPickItem, window } from 'vscode';

export async function servicePicker(title: string, services: Service[]): Promise<string> {
    const servicePickItems: QuickPickItem[] = services.map(service => ({label: service.metadata.name}));
    const servicePick = await window.showQuickPick(servicePickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: title
    });

    if (servicePick?.label) {
        return servicePick.label;
    }

    throw new Error('No service selected');
}