'use strict';

import { ShellResult } from '../../../utils/shell';
import * as wrapper from '../../wrapper';

export async function run(projectID?: string, emailAddress?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('roles invitations delete');
    
    if(projectID && emailAddress) {
        command.addArgument({name: 'email', description: 'email address of the user to remove the invite for', defaultValue: emailAddress, show: false});
        command.addFlag({name: 'project', description: 'the project remove the invite from', required: true, defaultValue: projectID, show: false});
    } else {
        command.addArgument({name: 'email', description: 'email address of the user to remove the invite for'});
        command.addFlag({name: 'project', description: 'the project remove the invite from', required: true});
    }

    return command.runCommand();
}