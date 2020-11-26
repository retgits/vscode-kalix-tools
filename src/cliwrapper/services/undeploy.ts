'use strict';

import { ShellResult } from '../../utils/shell';
import * as wrapper from '../wrapper';

export async function run(projectID?: string, serviceName?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('services undeploy');

    if (projectID && serviceName) {
        command.addArgument({ name: 'service', description: 'name of the service', defaultValue: serviceName, show: false });
        command.addFlag({ name: 'project', description: 'the project to deploy to', required: true, defaultValue: projectID, show: false });
    } else {
        command.addArgument({ name: 'service', description: 'name of the service' });
        command.addFlag({ name: 'project', description: 'the project to deploy to', required: true });
    }

    return command.runCommand();
}