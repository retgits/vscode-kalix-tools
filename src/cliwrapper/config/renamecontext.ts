'use strict';

import { Command } from '../wrapper';

export async function fromCLI() {
    let command = new Command('config rename-context');
    command.addArgument({name: 'context', description: 'new name of the current context'});
    await command.runCommand();
}

export async function fromUI() {
    let command = new Command('config rename-context');
    command.addArgument({name: 'context', description: 'new name of the current context'});
    await command.runCommand();
}