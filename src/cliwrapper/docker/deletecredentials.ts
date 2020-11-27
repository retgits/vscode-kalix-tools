'use strict';

import { ShellResult } from '../../utils/shell';
import * as wrapper from '../wrapper';

export async function run(projectID?: string, credentialID?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('docker delete-credentials');

    if (projectID && credentialID) {
        command.addFlag({ name: 'project', description: 'the project remove the credential from', required: true, defaultValue: projectID, show: false });
        command.addFlag({ name: 'credential', description: 'ID of the credential to remove', required: true, defaultValue: credentialID, show: false });
    } else {
        command.addFlag({ name: 'project', description: 'the project remove the credential from', required: true });
        command.addFlag({ name: 'credential', description: 'ID of the credential to remove', required: true });
    }

    return command.runCommand();
}