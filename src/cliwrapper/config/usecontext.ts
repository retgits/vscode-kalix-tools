'use strict'

import * as wrapper from '../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('config use-context')
    command.addArgument({name: 'context', description: 'name of the context to use'})
    await command.runCommand()
}

export async function fromUI() {
    let command = new wrapper.Command('config use-context')
    command.addArgument({name: 'context', description: 'name of the context to use'})
    await command.runCommand()
}