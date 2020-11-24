'use strict'

import * as wrapper from '../wrapper';
import * as projects from '../../views/projectexplorer/explorer';

export async function fromCLI(projectExplorer: projects.ProjectExplorer) {
    let command = new wrapper.Command('services unexpose')
    command.addArgument({name: 'service', description: 'name of the service'})
    command.addArgument({name: 'hostname', description: 'hostname to remove'})
    command.addFlag({name: 'project', description: 'the project to deploy to', required: true})
    await command.runCommand()
    projectExplorer.refresh()
}

export async function fromUI(projectID: string, serviceName: string,projectExplorer: projects.ProjectExplorer) {
    let command = new wrapper.Command('services unexpose')
    command.addArgument({name: 'service', description: 'name of the service', defaultValue: serviceName, show: false})
    command.addArgument({name: 'hostname', description: 'hostname to remove'})
    command.addFlag({name: 'project', description: 'the project to deploy to', required: true, defaultValue: projectID, show: false})
    await command.runCommand()
    projectExplorer.refresh()
}