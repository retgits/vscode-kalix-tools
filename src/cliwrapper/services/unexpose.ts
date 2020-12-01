'use strict';

import { ShellResult } from '../../utils/shell';
import { AkkaServerless } from '../../akkasls';
import { Command } from '../wrapper';
import { window } from 'vscode';

export async function UnexposeService(akkasls: AkkaServerless, projectID?: string, serviceName?: string): Promise<ShellResult | null> {
    let command = new Command('services expose');

    if(!projectID) {
        let result = await window.showQuickPick(akkasls.getProjectsArray(), {
            placeHolder: 'Pick your project...'
        });
        projectID = await akkasls.getProjectIDByName(result!);
    }

    if (!serviceName) {
        let result = await window.showQuickPick(akkasls.getServiceArray(projectID), {
            placeHolder: 'Pick your service...'
        });
        serviceName = result!;
    }

    let result = await window.showQuickPick(akkasls.getHostnamesByProjectID(projectID), {
        placeHolder: 'Pick your hostname...'
    });
    let hostname = result!;
    
    command.addArgument({name: 'service', description: 'name of the service', defaultValue: serviceName, show: false});
    command.addArgument({name: 'hostname', description: 'hostname to remove', defaultValue: hostname, show: false});
    command.addFlag({name: 'project', description: 'the project to expose a service from', required: true, defaultValue: projectID, show: false});

    return command.runCommand();
}