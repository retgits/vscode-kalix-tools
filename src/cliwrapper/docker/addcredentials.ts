'use strict';

import { ShellResult } from '../../utils/shell';
import * as wrapper from '../wrapper';

export async function run(projectID?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('docker add-credentials');

    if(projectID) {
        command.addFlag({name: 'project', description: 'the project to deploy to', required: true, defaultValue: projectID, show: false});
    } else {
        command.addFlag({name: 'project', description: 'the project to deploy to', required: true});
    }

    command.addArgument({name: 'Credentials', description: 'Credentials string', defaultValue: '--docker-email <> --docker-password <> --docker-server <> --docker-username <>'})

    return command.runCommand();
}