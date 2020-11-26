'use strict';

// Imports
import * as invite from './datatypes/roles/invitations/invite';
import * as member from './datatypes/roles/member';
import * as project from './datatypes/projects/project';
import * as service from './datatypes/services/service';
import * as listProjects from './cliwrapper/projects/list';
import * as listMembers from './cliwrapper/roles/listbindings';
import * as listInvites from './cliwrapper/roles/invitations/listinvites';
import * as listServices from './cliwrapper/services/list';

export const CONSOLE_URL = "https://console.cloudstate.com/project";

export class AkkaServerless {
    private projects: project.Project[] = [];
    private members: Map<string, member.Member[]> = new Map();
    private invites: Map<string, invite.Invite[]> = new Map();
    private services: Map<string, service.Service[]> = new Map();
    
    constructor() {}

    async getProjects(): Promise<project.Project[]> {
        if (this.projects.length === 0) {
            this.projects = await this.refreshProjects();
        }
        return this.projects;
    }

    async refreshProjects(): Promise<project.Project[]> {
        let projects = await listProjects.run();
        this.projects = projects;
        return projects;
    }

    async getMembers(projectID: string): Promise<member.Member[]> {
        if(this.members.has(projectID)) {
            return this.members.get(projectID)!;
        }
        let members = await this.refreshMembers(projectID);
        return members;
    }

    async refreshMembers(projectID: string): Promise<member.Member[]> {
        let members = await listMembers.run(projectID);
        this.members.set(projectID, members);
        return members;
    }

    async getInvites(projectID: string): Promise<invite.Invite[]> {
        if(this.invites.has(projectID)) {
            return this.invites.get(projectID)!;
        }
        let invites = await this.refreshInvites(projectID);
        return invites;
    }

    async refreshInvites(projectID: string): Promise<invite.Invite[]> {
        let invites = await listInvites.run(projectID);
        this.invites.set(projectID, invites);
        return invites;
    }

    async getServices(projectID: string): Promise<service.Service[]> {
        if(this.services.has(projectID)) {
            return this.services.get(projectID)!;
        }
        let services = await this.refreshServices(projectID);
        return services;
    }
    
    async refreshServices(projectID: string): Promise<service.Service[]> {
        let services = await listServices.run(projectID);
        this.services.set(projectID, services);
        return services;
    }
}