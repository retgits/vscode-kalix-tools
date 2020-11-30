'use strict';

import { ShellResult } from '../../utils/shell';
import * as akkasls from '../../akkasls';
import * as wrapper from '../wrapper';
import { window } from 'vscode';

export async function run(akkasls: akkasls.AkkaServerless, projectID?: string, serviceName?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('services undeploy');

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

    command.addArgument({ name: 'service', description: 'name of the service', defaultValue: serviceName, show: false });
    command.addFlag({ name: 'project', description: 'the project to undeploy from', required: true, defaultValue: projectID, show: false });

    return command.runCommand();
}