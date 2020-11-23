'use strict'

// Imports
import * as invite from './datatypes/invite'
import * as member from './datatypes/member'
import * as project from './datatypes/project'
import * as service from './datatypes/service';
import { shell } from './utils/shell';

export const CONSOLE_URL = "https://console.cloudstate.com/project"

export class AkkaServerless {
    private readonly binaryName: string = 'akkasls';
    
    constructor() {}

    async getProjects(): Promise<project.Project[]> {
        let shellResult = await shell.exec(`${this.binaryName} projects list -o json`)
        return project.Convert.toProjectArray(shellResult.stdout)
    }

    async getMembersByProject(projectID: string): Promise<member.Member[]> {
        let shellResult = await shell.exec(`${this.binaryName} roles list-bindings --project ${projectID} -o json`)
        return member.Convert.toMemberArray(shellResult.stdout)
    }

    async getInvitesByProject(projectID: string): Promise<invite.Invite[]> {
        let shellResult = await shell.exec(`${this.binaryName} roles invitations list --project ${projectID} -o json`)
        return invite.Convert.toInviteArray(shellResult.stdout)
    }

    async getServicesByProject(projectID: string): Promise<service.Service[]> {
        let shellResult = await shell.exec(`${this.binaryName} svc list --project ${projectID} -o json`)
        if (shellResult.code == 1) {
            return service.Convert.toServiceArray('[]')    
        }
        return service.Convert.toServiceArray(shellResult.stdout)
    }
}