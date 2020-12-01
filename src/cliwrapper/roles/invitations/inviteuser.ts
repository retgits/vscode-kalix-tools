'use strict';

import { ShellResult } from '../../../utils/shell';
import { AkkaServerless } from '../../../akkasls';
import { Command } from '../../wrapper';
import { window } from 'vscode';

export async function AddInvite(akkasls: AkkaServerless,projectID?: string): Promise<ShellResult | null> {
    let command = new Command('roles invitations invite-user');
    command.addArgument({name: 'email', description: 'email address of the user to invite'});

    if(!projectID) {
        let result = await window.showQuickPick(akkasls.getProjectsArray(), {
            placeHolder: 'Pick your project...'
        });
        projectID = await akkasls.getProjectIDByName(result!);
    }

    command.addFlag({name: 'role', description: 'role to give to the user', required: true, defaultValue: 'admin', show: false});
    command.addFlag({name: 'project', description: 'the project remove the invite from', required: true, defaultValue: projectID, show: false});

    return command.runCommand();
}