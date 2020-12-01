import { CurrentLogin } from './auth/currentlogin';
import { TokenList } from './auth/tokenlist';
import { CurrentContext } from './config/currentcontext';
import { GetProject } from './config/getproject';
import { ListCredentials } from './docker/listcredentials';
import { Project } from './projects/project';
import { Invite } from './roles/invitations/invite';
import { Member } from './roles/member';
import { ASConfig, GetIPAddress } from './services/local';
import { Service } from './services/service';
import { Tool } from './tool';

// Converts JSON strings to/from your types
export class Convert {
    public static toCurrentLogin(json: string): CurrentLogin {
        return JSON.parse(json);
    }

    public static currentLoginToJson(value: CurrentLogin): string {
        return JSON.stringify(value);
    }

    public static toTokenList(json: string): TokenList[] {
        return JSON.parse(json);
    }

    public static tokenListToJson(value: TokenList[]): string {
        return JSON.stringify(value);
    }

    public static toContexts(json: string): string[] {
        return JSON.parse(json);
    }

    public static contextsToJson(value: string[]): string {
        return JSON.stringify(value);
    }

    public static toCurrentContext(json: string): CurrentContext {
        return JSON.parse(json);
    }

    public static currentContextToJson(value: CurrentContext): string {
        return JSON.stringify(value);
    }

    public static toGetProject(json: string): GetProject {
        return JSON.parse(json);
    }

    public static getProjectToJson(value: GetProject): string {
        return JSON.stringify(value);
    }

    public static toListCredentials(json: string): ListCredentials[] {
        return JSON.parse(json);
    }

    public static listCredentialsToJson(value: ListCredentials[]): string {
        return JSON.stringify(value);
    }

    public static toProjectArray(json: string): Project[] {
        return JSON.parse(json);
    }

    public static projectsToJson(value: Project[]): string {
        return JSON.stringify(value);
    }

    public static toInviteArray(json: string): Invite[] {
        return JSON.parse(json);
    }

    public static invitesToJson(value: Invite[]): string {
        return JSON.stringify(value);
    }

    public static toMemberArray(json: string): Member[] {
        return JSON.parse(json);
    }

    public static membersToJson(value: Member[]): string {
        return JSON.stringify(value);
    }

    public static toASConfig(json: string): ASConfig {
        let config: ASConfig = JSON.parse(json);
        if (!config.Resources.Docker.Host) {
            config.Resources.Docker.Host = GetIPAddress();
        }
        return config;
    }

    public static toServiceArray(json: string): Service[] {
        return JSON.parse(json);
    }

    public static servicesToJson(value: Service[]): string {
        return JSON.stringify(value);
    }

    public static toToolArray(json: string): Tool[] {
        return JSON.parse(json);
    }

    public static toolsToJson(value: Tool[]): string {
        return JSON.stringify(value);
    }
}