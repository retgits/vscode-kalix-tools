'use strict';

import { Command } from '../wrapper';

export async function fromCLI() {
    let command = new Command('config current-context');
    await command.runCommand();
}

export async function fromUI() {
    let command = new Command('config current-context');
    await command.runCommand();
}