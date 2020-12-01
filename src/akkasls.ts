'use strict';

// Imports
import { Invite } from './datatypes/roles/invitations/invite';
import { Member } from './datatypes/roles/member';
import { Project } from './datatypes/projects/project';
import { Service } from './datatypes/services/service';
import { TokenList } from './datatypes/auth/tokenlist';
import { ListCredentials } from './datatypes/docker/listcredentials';

import { ListProjects } from './cliwrapper/projects/list';
import { ListMembers } from './cliwrapper/roles/listbindings';
import { ListInvites } from './cliwrapper/roles/invitations/listinvites';
import { ListServices } from './cliwrapper/services/list';
import { ListTokens } from './cliwrapper/auth/tokens/list';
import { ListDockerCredentials } from './cliwrapper/docker/listcredentials';
import { Login } from './cliwrapper/auth/login';
import { Logout } from './cliwrapper/auth/logout';
import { AddDockerCredentials } from './cliwrapper/docker/addcredentials';
import { DeleteDockerCredentials } from './cliwrapper/docker/deletecredentials';
import { DeployService } from './cliwrapper/services/deploy';
import { UndeployService } from './cliwrapper/services/undeploy';
import { ExposeService } from './cliwrapper/services/expose';
import { UnexposeService } from './cliwrapper/services/unexpose';
import { AddInvite } from './cliwrapper/roles/invitations/inviteuser';
import { DeleteInvite } from './cliwrapper/roles/invitations/delete';
import { NewProject } from './cliwrapper/projects/new';
import { RevokeToken } from './cliwrapper/auth/tokens/revoke';
import { StartLocal } from './cliwrapper/services/local/start';
import { StopLocal } from './cliwrapper/services/local/stop';

import { ProjectExplorer } from './views/projectexplorer/explorer';
import { CredentialsExplorer } from './views/credentialsexplorer/explorer';

import { Uri, window } from 'vscode';

export const CONSOLE_URL = "https://console.cloudstate.com/project";

export class AkkaServerless {
    private projects: Project[] = [];
    private members: Map<string, Member[]> = new Map();
    private invites: Map<string, Invite[]> = new Map();
    private services: Map<string, Service[]> = new Map();
    private credentials: Map<string, ListCredentials[]> = new Map();
    private credentialsExplorer: CredentialsExplorer;
    private projectExplorer: ProjectExplorer;

    constructor() { }

    registerCredentialsExplorer(credentialsExplorer: CredentialsExplorer) {
        this.credentialsExplorer = credentialsExplorer;
    }

    registerProjectExplorer(projectExplorer: ProjectExplorer) {
        this.projectExplorer = projectExplorer;
    }

    async getProjects(): Promise<Project[]> {
        if (this.projects.length === 0) {
            this.projects = await this.refreshProjects();
        }
        return this.projects;
    }

    async refreshProjects(): Promise<Project[]> {
        let projects = await ListProjects();
        this.projects = projects;
        return projects;
    }

    async createNewProject() {
        NewProject().then(() => {
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
        let name = '';
        (await this.getProjects()).forEach(project => {
            if (projectName === project.friendly_name) {
                name = project.name.substring(9);
            }
        });
        return name;
    }

    async getHostnamesByProjectID(projectID: string): Promise<string[]> {
        let hostnames: string[] = [];
        (await this.getProjects()).forEach(project => {
            if (projectID === project.name.substring(9)) {
                if (project.hostnames) {
                    project.hostnames.forEach(hostname => {
                        hostnames.push(hostname.name);
                    });
                }
            }
        });
        return hostnames;
    }

    async getMembers(projectID: string): Promise<Member[]> {
        if (this.members.has(projectID)) {
            return this.members.get(projectID)!;
        }
        let members = await this.refreshMembers(projectID);
        return members;
    }

    async refreshMembers(projectID: string): Promise<Member[]> {
        let members = await ListMembers(projectID);
        this.members.set(projectID, members);
        return members;
    }

    async getInvites(projectID: string): Promise<Invite[]> {
        if (this.invites.has(projectID)) {
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

    async refreshInvites(projectID: string): Promise<Invite[]> {
        let invites = await ListInvites(projectID);
        this.invites.set(projectID, invites);
        return invites;
    }

    async inviteUser(projectID?: string) {
        AddInvite(this, projectID).then(() => {
            if (projectID) {
                this.refreshInvites(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async deleteInvite(projectID?: string, emailAddress?: string) {
        DeleteInvite(this, projectID, emailAddress).then(() => {
            if (projectID) {
                this.refreshInvites(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async getServices(projectID: string): Promise<Service[]> {
        if (this.services.has(projectID)) {
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

    async refreshServices(projectID: string): Promise<Service[]> {
        let services = await ListServices(projectID);
        this.services.set(projectID, services);
        return services;
    }

    async deployService(projectID?: string) {
        DeployService(this, projectID).then(() => {
            if (projectID) {
                this.refreshServices(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async undeployService(projectID?: string, serviceName?: string) {
        UndeployService(this, projectID, serviceName).then(() => {
            if (projectID) {
                this.refreshServices(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async exposeService(projectID?: string, serviceName?: string) {
        ExposeService(this, projectID, serviceName).then(() => {
            if (projectID) {
                this.refreshServices(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async unexposeService(projectID?: string, serviceName?: string) {
        UnexposeService(this, projectID, serviceName).then(() => {
            if (projectID) {
                this.refreshServices(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async login() {
        Login();
    }

    async logout() {
        Logout();
    }

    async getTokens(): Promise<TokenList[]> {
        return ListTokens();
    }

    async getTokenArray(): Promise<string[]> {
        let tokens: string[] = [];
        (await this.getTokens()).forEach(token => {
            let tokenElements = token.name.split('/');
            tokens.push(tokenElements[tokenElements.length - 1]);
        });
        return tokens;
    }

    async revokeToken(tokenID?: string) {
        RevokeToken(this, tokenID).then(() => {
            this.credentialsExplorer.refresh();
        });
    }

    async refreshDockerCredentials(projectID: string): Promise<ListCredentials[]> {
        let creds = await ListDockerCredentials(projectID);
        this.credentials.set(projectID, creds);
        return creds;
    }

    async getDockerCredentials(projectID: string): Promise<ListCredentials[]> {
        if (this.credentials.has(projectID)) {
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
        let name = '';
        (await this.getDockerCredentials(projectID)).forEach(cred => {
            if (cred.server === serverName) {
                name = cred.name;
            }
        });
        return name;
    }

    async addDockerCredentials(projectID?: string) {
        AddDockerCredentials(this, projectID).then(() => {
            if (projectID) {
                this.refreshDockerCredentials(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async deleteDockerCredentials(projectID?: string, credentialID?: string) {
        DeleteDockerCredentials(this, projectID, credentialID).then(() => {
            if (projectID) {
                this.refreshDockerCredentials(projectID!).then(() => {
                    this.projectExplorer.refresh();
                });
            }
        });
    }

    async startLocal(doc?: Uri) {
        try {
            StartLocal(doc?.path);
        }
        catch (Error) {
            window.showErrorMessage(Error.message);
        }
    }

    async stopLocal(doc?: Uri) {
        try {
            StopLocal(doc?.path);
        }
        catch (Error) {
            window.showErrorMessage(Error);
        }
    }
}