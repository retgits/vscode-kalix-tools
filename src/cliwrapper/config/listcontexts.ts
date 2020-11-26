'use strict'

import * as wrapper from '../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('config list-contexts')
    await command.runCommand()
}

export async function fromUI() {
    let command = new wrapper.Command('config list-contexts')
    await command.runCommand()
}