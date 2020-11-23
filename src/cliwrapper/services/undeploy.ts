'use strict'

import * as wrapper from '../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('services undeploy')
    command.addArgument({name: 'service', description: 'name of the service'})
    command.addFlag({name: 'project', description: 'the project to deploy to', required: true})
    command.runCommand()
}

export async function fromUI(projectID: string, serviceName: string) {
    let command = new wrapper.Command('services undeploy')
    command.addArgument({name: 'service', description: 'name of the service', defaultValue: serviceName, show: false})
    command.addFlag({name: 'project', description: 'the project to deploy to', required: true, defaultValue: projectID, show: false})
    command.runCommand()
}