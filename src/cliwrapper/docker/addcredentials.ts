'use strict';

import { ShellResult } from '../../utils/shell';
import { AkkaServerless } from '../../akkasls';
import { Command } from '../wrapper';
import { window } from 'vscode';

export async function AddDockerCredentials(akkasls: AkkaServerless, projectID?: string): Promise<ShellResult | null> {
    let command = new Command('docker add-credentials');

    if(!projectID) {
        let result = await window.showQuickPick(akkasls.getProjectsArray(), {
            placeHolder: 'Pick your project...'
        });
        projectID = await akkasls.getProjectIDByName(result!);
    }

    command.addArgument({name: 'Credentials', description: 'Credentials string', defaultValue: '--docker-email <> --docker-password <> --docker-server <> --docker-username <>'});
    command.addFlag({name: 'project', description: 'the project to deploy to', required: true, defaultValue: projectID, show: false});

    return command.runCommand();
}