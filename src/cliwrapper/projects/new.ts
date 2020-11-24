'use strict'

import * as wrapper from '../wrapper';
import * as projects from '../../views/projectexplorer/explorer';

export async function fromCLI(projectExplorer: projects.ProjectExplorer) {
    let command = new wrapper.Command('projects new')
    command.addArgument({name: 'name', description: 'name of the project'})
    command.addArgument({name: 'description', description: 'a description to show in the UI'})
    await command.runCommand()
    projectExplorer.refresh()
}

export async function fromUI(projectExplorer: projects.ProjectExplorer) {
    let command = new wrapper.Command('projects new')
    command.addArgument({name: 'name', description: 'name of the project'})
    command.addArgument({name: 'description', description: 'a description to show in the UI'})
    await command.runCommand()
    projectExplorer.refresh()
}