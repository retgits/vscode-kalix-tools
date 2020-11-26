'use strict';

import { ShellResult } from '../../utils/shell';
import * as wrapper from '../wrapper';

export async function run(): Promise<ShellResult | null> {
    let command = new wrapper.Command('projects new');
    command.addArgument({name: 'name', description: 'name of the project'});
    command.addArgument({name: 'description', description: 'a description to show in the UI'});
    return command.runCommand();
}

