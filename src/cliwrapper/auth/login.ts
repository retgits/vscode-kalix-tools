'use strict'

import * as wrapper from '../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('auth login')
    command.addArgument({name: 'additional flags', description: 'any additional flags you want to add'})
    await command.runCommand()
}

export async function fromUI() {
    let command = new wrapper.Command('auth login')
    command.addArgument({name: 'additional flags', description: 'any additional flags you want to add'})
    await command.runCommand()
}