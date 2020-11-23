'use strict'

import * as wrapper from '../wrapper';

export async function fromCLI() {
    let command = new wrapper.Command('services deploy')
    command.addArgument({name: 'service', description: 'name of the service'})
    command.addArgument({name: 'image', description: 'container image url'})
    command.addFlag({name: 'project', description: 'the project to deploy to', required: true})
    command.runCommand()
}

export async function fromUI(projectID: string) {
    let command = new wrapper.Command('services deploy')
    command.addArgument({name: 'service', description: 'name of the service'})
    command.addArgument({name: 'image', description: 'container image url'})
    command.addFlag({name: 'project', description: 'the project to deploy to', required: true, defaultValue: projectID, show: false})
    command.runCommand()
}