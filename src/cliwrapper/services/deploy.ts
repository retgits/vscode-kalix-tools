'use strict';

import { ShellResult } from '../../utils/shell';
import * as wrapper from '../wrapper';

export async function run(projectID?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('services deploy');
    command.addArgument({name: 'service', description: 'name of the service'});
    command.addArgument({name: 'image', description: 'container image url'});

    if(projectID) {
        command.addFlag({name: 'project', description: 'the project to deploy to', required: true, defaultValue: projectID, show: false});
    } else {
        command.addFlag({name: 'project', description: 'the project to deploy to', required: true});
    }

    return command.runCommand();
}