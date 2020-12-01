'use strict';

import { ShellResult } from '../../utils/shell';
import { Command } from '../wrapper';

export async function NewProject(): Promise<ShellResult | null> {
    let command = new Command('projects new');
    command.addArgument({name: 'name', description: 'name of the project'});
    command.addArgument({name: 'description', description: 'a description to show in the UI'});
    return command.runCommand();
}

