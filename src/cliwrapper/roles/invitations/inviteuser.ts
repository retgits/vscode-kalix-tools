'use strict'

import * as wrapper from '../../wrapper';
import * as projects from '../../../views/projectexplorer/explorer';

export async function fromCLI(projectExplorer: projects.ProjectExplorer) {
    let command = new wrapper.Command('roles invitations invite-user')
    command.addArgument({name: 'email', description: 'email address of the user to invite'})
    command.addFlag({name: 'project', description: 'the project to deploy to', required: true})
    await command.runCommand()
    projectExplorer.refresh()
}

export async function fromUI(projectID: string, projectExplorer: projects.ProjectExplorer) {
    let command = new wrapper.Command('roles invitations invite-user')
    command.addArgument({name: 'email', description: 'email address of the user to invite'})
    command.addFlag({name: 'project', description: 'the project to deploy to', required: true, defaultValue: projectID, show: false})
    await command.runCommand()
    projectExplorer.refresh()
}