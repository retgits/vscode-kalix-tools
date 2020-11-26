'use strict'

import * as wrapper from '../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('config set')
    command.addArgument({name: 'key', description: 'the key of the item to set'})
    command.addArgument({name: 'value', description: 'the value of the item to set'})
    await command.runCommand()
}

export async function fromUI() {
    let command = new wrapper.Command('config set')
    command.addArgument({name: 'key', description: 'the key of the item to set'})
    command.addArgument({name: 'value', description: 'the value of the item to set'})
    await command.runCommand()
}