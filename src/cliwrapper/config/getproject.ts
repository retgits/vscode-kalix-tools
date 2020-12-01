'use strict';

import { Command } from '../wrapper';

export async function fromCLI() {
    let command = new Command('config get-project');
    await command.runCommand();
}

export async function fromUI() {
    let command = new Command('config get-project');
    await command.runCommand();
}