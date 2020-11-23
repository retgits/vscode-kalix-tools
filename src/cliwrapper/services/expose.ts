'use strict'

import * as wrapper from '../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('services expose')
    command.addArgument({name: 'service', description: 'name of the service'})
    command.addArgument({name: 'additional flags', description: 'any additional flags you want to add'})
    command.addFlag({name: 'project', description: 'the project to expose a service from', required: true})
    command.runCommand()
}

export async function fromUI(projectID: string, serviceName: string) {
    let command = new wrapper.Command('services expose')
    command.addArgument({name: 'service', description: 'name of the service', defaultValue: serviceName, show: false})
    command.addArgument({name: 'additional flags', description: 'any additional flags you want to add'})
    command.addFlag({name: 'project', description: 'the project to deploy to', required: true, defaultValue: projectID, show: false})
    command.runCommand()
}