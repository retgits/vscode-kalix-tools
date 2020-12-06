import { CurrentLogin } from './auth/currentlogin';
import { Token } from './auth/tokens';
import { CurrentContext } from './config/currentcontext';
import { GetProject } from './config/getproject';
import { Credential } from './docker/credentials';
import { Project } from './projects/project';
import { Invite } from './roles/invitations/invite';
import { Member } from './roles/member';
import { Service } from './services/service';

export class Convert {
    public static toCurrentLogin(json: string): CurrentLogin {
        return JSON.parse(json);
    }

    public static toTokenList(json: string): Token[] {
        return JSON.parse(json);
    }

    public static toContexts(json: string): string[] {
        return JSON.parse(json);
    }


    public static toCurrentContext(json: string): CurrentContext {
        return JSON.parse(json);
    }


    public static toGetProject(json: string): GetProject {
        return JSON.parse(json);
    }


    public static toCredentials(json: string): Credential[] {
        return JSON.parse(json);
    }


    public static toProjectArray(json: string): Project[] {
        return JSON.parse(json);
    }


    public static toInviteArray(json: string): Invite[] {
        return JSON.parse(json);
    }


    public static toMemberArray(json: string): Member[] {
        return JSON.parse(json);
    }

    public static toServiceArray(json: string): Service[] {
        return JSON.parse(json);
    }
}