'use strict';

// Imports
import * as invite from './datatypes/roles/invitations/invite';
import * as member from './datatypes/roles/member';
import * as project from './datatypes/projects/project';
import * as service from './datatypes/services/service';
import * as token from './datatypes/auth/tokenlist';
import * as credentials from './datatypes/docker/listcredentials';

import * as listProjects from './cliwrapper/projects/list';
import * as listMembers from './cliwrapper/roles/listbindings';
import * as listInvites from './cliwrapper/roles/invitations/listinvites';
import * as listServices from './cliwrapper/services/list';
import * as listTokens from './cliwrapper/auth/tokens/list';
import * as listCredentials from './cliwrapper/docker/listcredentials';

import * as authLogin from './cliwrapper/auth/login';
import * as authLogout from './cliwrapper/auth/logout';
import * as addDockerCredentials from './cliwrapper/docker/addcredentials';
import * as deleteDockerCredentials from './cliwrapper/docker/deletecredentials';
import * as deployService from './cliwrapper/services/deploy';
import * as undeployService from './cliwrapper/services/undeploy';
import * as exposeService from './cliwrapper/services/expose';
import * as unexposeService from './cliwrapper/services/unexpose';
import * as inviteUser from './cliwrapper/roles/invitations/inviteuser';
import * as deleteInvite from './cliwrapper/roles/invitations/delete';
import * as createProject from './cliwrapper/projects/new';
import * as revokeToken from './cliwrapper/auth/tokens/revoke';
import * as startLocalService from './cliwrapper/services/local/start';
import * as stopLocalService from './cliwrapper/services/local/stop';

import * as projectExplorer from './views/projectexplorer/explorer';
import * as credentialsExplorer from './views/credentialsexplorer/explorer';

import * as vscode from 'vscode';

export const CONSOLE_URL = "https://console.cloudstate.com/project";

export class AkkaServerless {
    private projects: project.Project[] = [];
    private members: Map<string, member.Member[]> = new Map();
    private invites: Map<string, invite.Invite[]> = new Map();
    private services: Map<string, service.Service[]> = new Map();
    private credentials: Map<string, credentials.ListCredentials[]> = new Map();
    private credentialsExplorer: credentialsExplorer.CredentialsExplorer;
    private projectExplorer: projectExplorer.ProjectExplorer;
    
    constructor() {}

    registerCredentialsExplorer(credentialsExplorer: credentialsExplorer.CredentialsExplorer) {
        this.credentialsExplorer = credentialsExplorer;
    }

    registerProjectExplorer(projectExplorer: projectExplorer.ProjectExplorer) {
        this.projectExplorer = projectExplorer;
    }

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

    async createNewProject() {
        createProject.run().then(() => {
            this.refreshProjects().then(() => {
                this.projectExplorer.refresh();
            });
        });
    }

    async getProjectsArray(): Promise<string[]> {
        let projects: string[] = [];
        (await this.getProjects()).forEach(project => {
            projects.push(project.friendly_name);
        });
        return projects;
    }

    async getProjectIDByName(projectName: string): Promise<string> {
        (await this.getProjects()).forEach(project => {
            if(projectName === project.friendly_name) {
                return project.name.substring(9);
            }
        });
        return '';
    }

    async getHostnamesByProjectID(projectID: string): Promise<string[]> {
        let hostnames: string[] = [];
        (await this.getProjects()).forEach(project => {
            if(projectID === project.name.substring(9)) {
                if(project.hostnames) {
                    project.hostnames.forEach(hostname => {
                        hostnames.push(hostname.name);
                    });
                }
            }
        });
        return hostnames;
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

    async getInvitesArray(projectID: string): Promise<string[]> {
        let invites: string[] = [];
        (await this.getInvites(projectID)).forEach(invite => {
            invites.push(invite.email);
        });
        return invites;
    }

    async refreshInvites(projectID: string): Promise<invite.Invite[]> {
        let invites = await listInvites.run(projectID);
        this.invites.set(projectID, invites);
        return invites;
    }

    async inviteUser(projectID?: string) {
        inviteUser.run(this, projectID).then(() => {
            if(projectID) {
                this.refreshInvites(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async deleteInvite(projectID?: string, emailAddress?: string) {
        deleteInvite.run(this, projectID, emailAddress).then(() => {
            if(projectID) {
                this.refreshInvites(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async getServices(projectID: string): Promise<service.Service[]> {
        if(this.services.has(projectID)) {
            return this.services.get(projectID)!;
        }
        let services = await this.refreshServices(projectID);
        return services;
    }

    async getServiceArray(projectID: string): Promise<string[]> {
        let services: string[] = [];
        (await this.getServices(projectID)).forEach(service => {
            services.push(service.metadata.name);
        });
        return services;
    }
    
    async refreshServices(projectID: string): Promise<service.Service[]> {
        let services = await listServices.run(projectID);
        this.services.set(projectID, services);
        return services;
    }

    async deployService(projectID?: string) {
        deployService.run(this, projectID).then(() => {
            if(projectID) {
                this.refreshServices(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async undeployService(projectID?: string, serviceName?: string) {
        undeployService.run(projectID, serviceName).then(() => {
            if(projectID) {
                this.refreshServices(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async exposeService(projectID?: string, serviceName?: string) {
        exposeService.run(this, projectID, serviceName).then(() => {
            if(projectID) {
                this.refreshServices(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async unexposeService(projectID?: string, serviceName?: string) {
        unexposeService.run(projectID, serviceName).then(() => {
            if(projectID) {
                this.refreshServices(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async login() {
        authLogin.run();
    }

    async logout() {
        authLogout.run();
    }

    async getTokens(): Promise<token.TokenList[]> {
        return listTokens.run();
    }

    async getTokenArray(): Promise<string[]> {
        let tokens: string[] = [];
        (await this.getTokens()).forEach(token => {
            let tokenElements = token.name.split('/');
            tokens.push(tokenElements[tokenElements.length-1]);
        });
        return tokens;
    }

    async revokeToken(tokenID?: string) {
        revokeToken.run(this, tokenID).then(() => {
            this.credentialsExplorer.refresh();
        });
    }

    async refreshDockerCredentials(projectID: string): Promise<credentials.ListCredentials[]> {
        let creds = await listCredentials.run(projectID);
        this.credentials.set(projectID, creds);
        return creds;
    }

    async getDockerCredentials(projectID: string): Promise<credentials.ListCredentials[]> {
        if(this.credentials.has(projectID)) {
            return this.credentials.get(projectID)!;
        }
        let creds = await this.refreshDockerCredentials(projectID);
        return creds;
    }

    async getDockerCredentialsArray(projectID: string): Promise<string[]> {
        let creds: string[] = [];
        (await this.getDockerCredentials(projectID)).forEach(cred => {
            creds.push(cred.server);
        });
        return creds;
    }

    async getDockerCredentialIDByServer(projectID: string, serverName: string): Promise<string> {
        (await this.getDockerCredentials(projectID)).forEach(cred => {
            if(cred.server === serverName) {
                return cred.name;
            }
        });
        return '';
    }

    async addDockerCredentials(projectID?: string) {
        addDockerCredentials.run(this, projectID).then(() => {
            if(projectID) {
                this.refreshDockerCredentials(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async deleteDockerCredentials(projectID?: string, credentialID?: string) {
        deleteDockerCredentials.run(this, projectID, credentialID).then(() => {
            if(projectID) {
                this.refreshDockerCredentials(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async startLocal(doc?: vscode.Uri) {
        try {
            startLocalService.run(doc?.path);
        }
        catch (Error) {
            vscode.window.showErrorMessage(Error.message);
        }
    }

    async stopLocal(doc?: vscode.Uri) {
        try {
            stopLocalService.run(doc?.path);
        }
        catch (Error) {
            vscode.window.showErrorMessage(Error);
        }
    }
}