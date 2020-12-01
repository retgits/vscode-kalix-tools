'use strict';

import { Command } from '../wrapper';

export async function fromCLI() {
    let command = new Command('config delete-context');
    command.addArgument({name: 'context', description: 'name of the context to delete'});
    await command.runCommand();
}

export async function fromUI() {
    let command = new Command('config delete-context');
    command.addArgument({name: 'context', description: 'name of the context to delete'});
    await command.runCommand();
}