'use strict'

import * as wrapper from '../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('auth current-login')
    await command.runCommand()
}

export async function fromUI() {
    let command = new wrapper.Command('auth current-login')
    await command.runCommand()
}