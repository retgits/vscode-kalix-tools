'use strict';

import { ShellResult } from '../../utils/shell';
import * as akkasls from '../../akkasls';
import * as wrapper from '../wrapper';
import { window } from 'vscode';

export async function run(akkasls: akkasls.AkkaServerless, projectID?: string, credentialID?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('docker delete-credentials');

    if(!projectID) {
        let result = await window.showQuickPick(akkasls.getProjectsArray(), {
            placeHolder: 'Pick your project...'
        });
        projectID = await akkasls.getProjectIDByName(result!);
    }

    if(!credentialID) {
        let result = await window.showQuickPick(akkasls.getDockerCredentialsArray(projectID), {
            placeHolder: 'Pick your credential...'
        });
        credentialID = await akkasls.getDockerCredentialIDByServer(projectID, result!);
    }

    command.addArgument({ name: 'credential', description: 'ID of the credential to remove', defaultValue: credentialID, show: false });
    command.addFlag({ name: 'project', description: 'the project remove the credential from', required: true, defaultValue: projectID, show: false });

    return command.runCommand();
}