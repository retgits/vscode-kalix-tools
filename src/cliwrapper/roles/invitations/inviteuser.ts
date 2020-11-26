'use strict';

import { ShellResult } from '../../../utils/shell';
import * as wrapper from '../../wrapper';

export async function run(projectID?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('roles invitations invite-user');
    command.addArgument({name: 'email', description: 'email address of the user to invite'});

    if(projectID) {
        command.addFlag({name: 'project', description: 'the project to invite to', required: true, defaultValue: projectID, show: false});
    } else {
        command.addFlag({name: 'project', description: 'the project to invite to', required: true});
    }

    return command.runCommand();
}