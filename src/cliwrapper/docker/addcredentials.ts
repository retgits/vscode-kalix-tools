'use strict'

import * as wrapper from '../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('docker add-credentials')
    command.addArgument({name: 'Credentials', description: 'Credentials string', defaultValue: '--docker-email <> --docker-password <> --docker-server <> --docker-username <>'})
    await command.runCommand()
}

export async function fromUI() {
    let command = new wrapper.Command('docker add-credentials')
    command.addArgument({name: 'Credentials', description: 'Credentials string', defaultValue: '--docker-email <> --docker-password <> --docker-server <> --docker-username <>'})
    await command.runCommand()
}