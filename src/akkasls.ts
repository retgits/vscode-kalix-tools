/**
 * Auth CLI actions
 */
import { login } from './akkasls/commands/auth/login';
import { logout } from './akkasls/commands/auth/logout';
import { currentLogin } from './akkasls/commands/auth/currentlogin';
import { listAuthTokens } from './akkasls/commands/auth/tokens/list';
import { revokeAuthToken } from './akkasls/commands/auth/tokens/revoke';

/**
 * Docker CLI actions
 */
import { addDockerCredentials } from './akkasls/commands/docker/addcredentials';
import { deleteDockerCredentials } from './akkasls/commands/docker/deletecredentials';
import { listDockerCredentials } from './akkasls/commands/docker/listcredentials';

/**
 * Projects CLI actions
 */
import { listProjects } from './akkasls/commands/projects/list';
import { newProject } from './akkasls/commands/projects/new';

/**
 * Roles CLI actions
 */
import { deleteInvite } from './akkasls/commands/roles/invitations/delete';
import { addInvite } from './akkasls/commands/roles/invitations/inviteuser';
import { listInvites } from './akkasls/commands/roles/invitations/list';
import { listMembers } from './akkasls/commands/roles/listbindings';

/**
 * Services CLI actions
 */
import { deployService } from './akkasls/commands/services/deploy';
import { exposeService } from './akkasls/commands/services/expose';
import { listServices } from './akkasls/commands/services/list';
import { undeployService } from './akkasls/commands/services/undeploy';
import { unexposeService } from './akkasls/commands/services/unexpose';

/**
 * Local Proxy CLI extensions
 */
import { startLocalProxy } from './akkasls/extensions/commands/localproxy/start';
import { stopLocalProxy } from './akkasls/extensions/commands/localproxy/stop';

/**
 * Utils
 */
import { Shell } from './utils/shell/shell';
import { window } from 'vscode';

/**
 * Wizards
 */
import { projectPicker } from './components/wizards/projectPicker';
import { inputBox } from './components/wizards/inputBox';
import { dockerCredentialsPicker } from './components/wizards/dockerCredentialsPicker';
import { servicePicker } from './components/wizards/servicePicker';
import { invitePicker } from './components/wizards/invitePicker';
import { tokenPicker } from './components/wizards/tokenPicker';

/**
 * DataTypes
 */
import { CurrentLogin } from './akkasls/datatypes/auth/currentlogin';
import { Token } from './akkasls/datatypes/auth/tokens';
import { Credential } from './akkasls/datatypes/docker/credentials';
import { ShellResult } from './utils/shell/datatypes';
import { Project } from './akkasls/datatypes/projects/project';
import { Invite } from './akkasls/datatypes/roles/invitations/invite';
import { Member } from './akkasls/datatypes/roles/member';
import { Service } from './akkasls/datatypes/services/service';

/**
 * Explorer viewa
 */
import { ProjectExplorer } from './components/views/projectexplorer/explorer';
import { ConfigExplorer } from './components/views/configexplorer/explorer';

export const CONSOLE_URL = "https://console.cloudstate.com/project";

export class AkkaServerless {
    private _shell: Shell;
    private _projectExplorer: ProjectExplorer;
    private _configExplorer: ConfigExplorer;

    /**
     * Create a new instance of AkkaServerless which handles communication between the VS code extension and the underlying commands
     * @param shell a shell that handles execution of commands
     */
    constructor(shell: Shell) {
        this._shell = shell;
    }

    registerProjectExplorer(pe: ProjectExplorer) {
        this._projectExplorer = pe;
    }

    registerConfigExplorer(ce: ConfigExplorer) {
        this._configExplorer = ce;
    }

    async login() {
        let result = await login(this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
    }

    async logout() {
        let result = await logout(this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
    }

    async getCurrentLogin(): Promise<CurrentLogin> {
        return currentLogin(this._shell);
    }

    async listAuthTokens(): Promise<Token[]> {
        return listAuthTokens(this._shell);
    }

    async revokeAuthToken(tokenID: string): Promise<ShellResult> {
        let result = await revokeAuthToken(tokenID, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        this._configExplorer.refresh();
        return result;
    }

    async addDockerCredentials(projectID: string, credentials: string): Promise<ShellResult> {
        let result = await addDockerCredentials(projectID, credentials, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        this._projectExplorer.refresh();
        return result;
    }

    async deleteDockerCredentials(projectID: string, credentialID: string): Promise<ShellResult> {
        let result = await deleteDockerCredentials(projectID, credentialID, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        this._projectExplorer.refresh();
        return result;
    }

    async listDockerCredentials(projectID: string): Promise<Credential[]> {
        let result = await listDockerCredentials(projectID, this._shell);
        return result;
    }

    async createNewProject(name: string, description: string): Promise<ShellResult> {
        let result = await newProject(name, description, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        this._projectExplorer.refresh();
        return result;
    }

    async listProjects(): Promise<Project[]> {
        let result = await listProjects(this._shell);
        return result;
    }

    async deleteInvite(projectID: string, emailAddress: string): Promise<ShellResult> {
        let result = await deleteInvite(projectID, emailAddress, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        this._projectExplorer.refresh();
        return result;
    }

    async addInvite(projectID: string, emailAddress: string) : Promise<ShellResult> {
        let result = await addInvite(projectID, emailAddress, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        this._projectExplorer.refresh();
        return result;
    }

    async listInvites(projectID: string): Promise<Invite[]> {
        let result = await listInvites(projectID, this._shell);
        return result;
    }

    async listMembers(projectID: string): Promise<Member[]> {
        let result = await listMembers(projectID, this._shell);
        return result;
    }

    async deployService(service:string, image:string, projectID:string): Promise<ShellResult> {
        let result = await deployService(service, image, projectID, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        this._projectExplorer.refresh();
        return result;
    }

    async exposeService(service:string, flags:string, projectID:string): Promise<ShellResult> {
        let result = await exposeService(service, flags, projectID, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        return result;
    }

    async listServices(projectID: string): Promise<Service[]> {
        let result = await listServices(projectID, this._shell);
        return result;
    }

    async undeployService(service:string, projectID:string): Promise<ShellResult> {
        let result = await undeployService(service, projectID, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        this._projectExplorer.refresh();
        return result;
    }

    async unexposeService(service:string, hostname:string, projectID:string): Promise<ShellResult> {
        let result = await unexposeService(service, hostname, projectID, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        return result;
    }

    async startLocalProxy(configfile: string, dockerImageUser: string): Promise<ShellResult> {
        let result = await startLocalProxy(configfile, dockerImageUser, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        return result;
    }

    async stopLocalProxy(configfile: string, dockerImageUser: string): Promise<ShellResult> {
        let result = await stopLocalProxy(configfile, dockerImageUser, this._shell);
        if (result.code !== 0) {
            window.showErrorMessage(result.stderr);
        }
        return result;
    }

    async addDockerCredentialsWizard(projectID?: string) {
        if(!projectID) {
            projectID = await projectPicker('pick a project to add credentials to...', await this.listProjects());
        }

        let credentials = await inputBox('--docker-server <> --docker-username <>> --docker-password <>', 'enter your credential string...');
        this.addDockerCredentials(projectID, credentials);
    }

    async deleteDockerCredentialsWizard(projectID?: string, credentialID?: string) {
        if(!projectID) {
            projectID = await projectPicker('pick a project to remove credentials from...', await this.listProjects());
        }

        if(!credentialID) {
            credentialID = await dockerCredentialsPicker(await this.listDockerCredentials(projectID));
        }

        this.deleteDockerCredentials(projectID, credentialID);
    }

    async deployServiceWizard(projectID?: string) {
        if(!projectID) {
            projectID = await projectPicker('pick a project to deploy your service to...', await this.listProjects());
        }

        let service = await inputBox('', 'type your service name...');
        let image = await inputBox('', 'type your docker image url...');

        this.deployService(service, image, projectID);
    }

    async undeployServiceWizard(projectID?: string, service?: string) {
        if(!projectID) {
            projectID = await projectPicker('pick a project to undeploy your service from...', await this.listProjects());
        }

        if(!service) {
            service = await servicePicker('pick the service to undeploy...', await this.listServices(projectID));
        }

        this.undeployService(service, projectID);
    }

    async exposeServiceWizard(projectID?: string, service?:string) {
        if(!projectID) {
            projectID = await projectPicker('pick a project to expose your service from...', await this.listProjects());
        }

        if(!service) {
            service = await servicePicker('pick the service to expose...', await this.listServices(projectID));
        }

        let flags = await inputBox('--enable-cors', 'type any additional flags you might want...');

        this.exposeService(service, flags, projectID);
    }

    async unexposeServiceWizard(projectID?: string, service?:string) {
        if(!projectID) {
            projectID = await projectPicker('pick a project to unexpose your service from...', await this.listProjects());
        }

        if(!service) {
            service = await servicePicker('pick the service to unexpose...', await this.listServices(projectID));
        }

        let hostname = await inputBox('', 'type the hostname you want to remove...');

        this.unexposeService(service, hostname, projectID);
    }

    async inviteUserWizard(projectID?: string) {
        if(!projectID) {
            projectID = await projectPicker('pick a project to invite a new person to...', await this.listProjects());
        }

        let emailAddress = await inputBox('', 'type the email address of the person you want to invite...');

        this.addInvite(projectID, emailAddress);
    }

    async deleteInviteWizard(projectID?: string, emailAddress?: string) {
        if(!projectID) {
            projectID = await projectPicker('pick a project to invite a new person to...', await this.listProjects());
        }

        if(!emailAddress) {
            emailAddress = await invitePicker('pick the email address to uninvite...', await this.listInvites(projectID));
        }

        this.deleteInvite(projectID, emailAddress);
    }

    async newProjectWizard() {
        let name = await inputBox('', 'type the name of the project you want to create...');
        let description = await inputBox('', 'type the description of the project you want to create...');
        this.createNewProject(name, description);
    }

    async revokeAuthTokenWizard() {
        let tokenID = await tokenPicker('pick the token you want to revoke...', await this.listAuthTokens());
        this.revokeAuthToken(tokenID);
    }
}