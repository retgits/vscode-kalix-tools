'use strict';

import { ShellResult } from '../../../utils/shell';
import * as akkasls from '../../../akkasls';
import * as wrapper from '../../wrapper';
import { window } from 'vscode';

export async function run(akkasls: akkasls.AkkaServerless, projectID?: string, emailAddress?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('roles invitations delete');

    if(!projectID) {
        let result = await window.showQuickPick(akkasls.getProjectsArray(), {
            placeHolder: 'Pick your project...'
        });
        projectID = await akkasls.getProjectIDByName(result!);
    }

    if (!emailAddress) {
        let result = await window.showQuickPick(akkasls.getInvitesArray(projectID), {
            placeHolder: 'Pick the email address to uninvite...'
        });
        emailAddress = result!;
    }
    
    command.addArgument({name: 'email', description: 'email address of the user to remove the invite for', defaultValue: emailAddress, show: false});
    command.addFlag({name: 'project', description: 'the project remove the invite from', required: true, defaultValue: projectID, show: false});


    return command.runCommand();
}