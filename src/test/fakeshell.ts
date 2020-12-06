import { ShellResult } from '../utils/shell/datatypes';
import { join } from 'path';
import { readFileSync } from 'fs-extra';

export interface Shell {
    exec(cmd: string, cwd?: string): Promise<ShellResult>;
    existsInPath(tool: string): boolean;
}

export const fakeShell: Shell = {
    exec: exec,
    existsInPath: existsInPath
};

function existsInPath(tool: string): boolean {
    return true;
}

function exec(cmd: string, cwd?: string): Promise<ShellResult> {
    let code: number;
    let stderr: string;
    let stdout: string;

    switch (cmd) {
        case 'akkasls auth tokens list -o json':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'auth.tokens.list.txt')).toString();
            break;
        case 'akkasls auth tokens revoke success':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'auth.tokens.revoke.success.txt')).toString();
            break;
        case 'akkasls auth tokens revoke failed':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'auth.tokens.revoke.failed.txt')).toString();
            break;
        case 'akkasls auth current-login':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'auth.currentlogin.txt')).toString();
            break;
        case 'akkasls auth login':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'auth.login.txt')).toString();
            break;
        case 'akkasls auth logout':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'auth.logout.txt')).toString();
            break;
        case 'akkasls docker add-credentials credentialstring --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'docker.addcredentials.txt')).toString();
            break;
        case 'akkasls docker delete-credentials success --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'docker.deletecredentials.success.txt')).toString();
            break;
        case 'akkasls docker delete-credentials failed --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'docker.deletecredentials.failed.txt')).toString();
            break;
        case 'akkasls docker list-credentials -o json --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'docker.listcredentials.txt')).toString();
            break;
        case 'akkasls projects list -o json':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'projects.listprojects.txt')).toString();
            break;
        case 'akkasls projects new my-app2 cool':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'projects.new.txt')).toString();
            break;
        case 'akkasls roles invitations delete email@example.com --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'roles.invitations.delete.txt')).toString();
            break;
        case 'akkasls roles invitations invite-user --role admin email@example.com --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'roles.invitations.inviteuser.txt')).toString();
            break;
        case 'akkasls roles invitations list -o json --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'roles.invitations.list.txt')).toString();
            break;
        case 'akkasls roles list-bindings -o json --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'roles.listbindings.txt')).toString();
            break;
        case 'akkasls services deploy example docker.io/example/example --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'services.deploy.txt')).toString();
            break;
        case 'akkasls services expose example --project projectID --enable-cors':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'services.expose.txt')).toString();
            break;
        case 'akkasls services list -o json --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'services.list.txt')).toString();
            break;
        case 'akkasls services unexpose example empty-king-8939.us-east1.apps.cloudstate.com --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'services.unexpose.txt')).toString();
            break;
        case 'akkasls services undeploy example --project projectID':
            code = 0;
            stderr = '';
            stdout = readFileSync(join(__dirname, '..', '..', '..', 'src', 'test', 'shellresponses', 'services.undeploy.txt')).toString();
            break;
        default:
            code = 0;
            stderr = '';
            stdout = '';
    }

    return new Promise<ShellResult>((resolve) => {
        resolve({ code: code, stdout: stdout, stderr: stderr });
    });
}