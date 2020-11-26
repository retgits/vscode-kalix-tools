'use strict';

import { ShellResult } from '../../utils/shell';
import * as wrapper from '../wrapper';

export async function run(projectID?: string, serviceName?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('services expose');
    
    if (serviceName) {
        command.addArgument({name: 'service', description: 'name of the service', defaultValue: serviceName, show: false});
    } else {
        command.addArgument({name: 'service', description: 'name of the service'});
    }

    command.addArgument({name: 'additional flags', description: 'any additional flags you want to add'});

    if(projectID) {
        command.addFlag({name: 'project', description: 'the project to expose a service from', required: true, defaultValue: projectID, show: false});
    } else {
        command.addFlag({name: 'project', description: 'the project to expose a service from', required: true});
    }

    return command.runCommand();
}