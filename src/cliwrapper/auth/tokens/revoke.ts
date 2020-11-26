'use strict'

import * as wrapper from '../../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('auth tokens list')
    command.addArgument({name: 'ID', description: 'ID of the token to revoke'})
    await command.runCommand()
}

export async function fromUI() {
    let command = new wrapper.Command('auth tokens list')
    command.addArgument({name: 'ID', description: 'ID of the token to revoke'})
    await command.runCommand()
}