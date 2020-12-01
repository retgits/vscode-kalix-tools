'use strict';

import { ShellResult } from '../../utils/shell';
import { AkkaServerless } from '../../akkasls';
import { Command } from '../wrapper';
import { window } from 'vscode';

export async function DeployService(akkasls: AkkaServerless, projectID?: string): Promise<ShellResult | null> {
    let command = new Command('services deploy');
    command.addArgument({name: 'service', description: 'name of the service'});
    command.addArgument({name: 'image', description: 'container image url'});

    if(!projectID) {
        let result = await window.showQuickPick(akkasls.getProjectsArray(), {
            placeHolder: 'Pick your project...'
        });
        projectID = await akkasls.getProjectIDByName(result!);
    }

    command.addFlag({name: 'project', description: 'the project to deploy to', required: true, defaultValue: projectID, show: false});

    return command.runCommand();
}