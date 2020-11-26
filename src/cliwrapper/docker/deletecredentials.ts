'use strict'

import * as wrapper from '../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('docker delete-credentials')
    command.addArgument({name: 'ID', description: 'ID of the credentials to delete'})
    await command.runCommand()
}

export async function fromUI() {
    let command = new wrapper.Command('docker delete-credentials')
    command.addArgument({name: 'ID', description: 'ID of the credentials to delete'})
    await command.runCommand()
}