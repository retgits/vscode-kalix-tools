// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Standard node imports
import { ChildProcess } from 'child_process';

// Internal dependencies
import { shell, ShellResult } from '../../shell';
import { logger } from '../../logger';

export const config = {
    auth: {
        currentLogin: 'akkasls auth current-login -o json',
        listAuthTokens: 'akkasls auth tokens list -o json',
        login: 'akkasls auth login --no-launch-browser',
        logout: 'akkasls auth logout',
        revokeAuthToken: 'akkasls auth tokens revoke',
        createAuthToken: 'akkasls auth tokens create'
    },
    docker: {
        addDockerCredentials: 'akkasls docker add-credentials',
        deleteDockerCredentials: 'akkasls docker delete-credentials',
        listDockerCredentials: 'akkasls docker list-credentials -o json'
    },
    entities: {
        generateNpmJs: 'akkasls entities generate npm js',
        generateNpxJs: 'npm_config_yes=true npx @lightbend/create-akkasls-entity',
        generateMavenJava: 'akkasls entities generate maven java'
    },
    projects: {
        newProject: 'akkasls projects new',
        listProjects: 'akkasls projects list -o json'
    },
    roles: {
        deleteInvite: 'akkasls roles invitations delete',
        addInvite: 'akkasls roles invitations invite-user',
        listInvites: 'akkasls roles invitations list -o json',
        listMembers: 'akkasls roles list-bindings -o json'
    },
    services: {
        deployService: 'akkasls services deploy',
        exposeService: 'akkasls services expose',
        listServices: 'akkasls services list -o json',
        deleteService: 'akkasls services undeploy',
        unexposeService: 'akkasls services unexpose',
        getServiceLogs: 'akkasls services logs'
    }
};

/**
 * An interface for global flags of `akkasls`
 *  * `dryrun`: print the command but do not execute it
 *  * `silent`: do not print any intermediate output and only return the result
 *  * `configFile`: the config file to use (default "~/.akkaserverless/config.yaml")
 *  * `context`: the configutation context to use
 *
 * @interface commandConfig
 */
export interface commandConfig {
    dryrun?: boolean;
    silent?: boolean;
    configFile?: string;
    context?: string;
}

/**
 * An interface for command line parameters of `akkasls`
 *  * `name`: the name of the parameter (should match the name of the parameter in `akkasls`)
 *  * `value`: the value of the parameter
 *  * `addNameToCommand`: whether the name of the parameter should be added to the command (like `--project` should have this set to true)
 * @interface Parameter
 */
export interface Parameter {
    name: string;
    value: string;
    addNameToCommand: boolean;
}

/**
 * An interface for flags of `akkasls services logs`
 * * `cloudstateLogs`: Whether cloudstate sidecar logs should be included
 * * `lifecycleLogs`: Whether lifecycle logs should be included
 * * `proxyLogs`: Whether HTTP proxy logs should be included
 * * `serviceLogs`: Whether service logs should be included
 * * `tail`: The maximum number of lines to fetch
 *
 * @interface LogTypes
 */
export interface LogTypes {
    cloudstateLogs?: boolean;
    lifecycleLogs?: boolean;
    proxyLogs?: boolean;
    serviceLogs?: boolean;
    tail?: number;
    follow?: boolean;
    callback?: ((proc: ChildProcess) => void);
}

/**
 * An interface for environment variables in `akkasls service` commands
 *  * `vars`: an optional array of strings representing key value pairs (like MSG=Hello)
 *
 * @interface EnvVars
 */
export interface EnvVars {
    vars?: string[];
}

export class Command {
    public readonly command: string;
    public readonly workingDir?: string;
    private _parameters: Parameter[] = [];
    private _silent = false;
    private _configFile = '';
    private _context = '';

    constructor(command: string, workingDir?: string) {
        this.command = command;
        this.workingDir = workingDir;
    }

    addParameter(p: Parameter): void {
        this._parameters.push({
            name: p.name,
            value: p.value,
            addNameToCommand: p.addNameToCommand
        });
    }

    setSilent(value: boolean | undefined): void {
        if (value) {
            this._silent = value;
        }
    }

    isSilent(): boolean {
        return this._silent;
    }

    setConfigFile(value: string | undefined): void {
        if (value) {
            this._configFile = value;
        }
    }

    setContext(value: string | undefined): void {
        if (value) {
            this._context = value;
        }
    }

    toString(): string {
        let str = this.command;

        this._parameters.forEach((cmd) => {
            if (cmd.addNameToCommand) {
                str += ` --${cmd.name}`;
            }
            str += ` ${cmd.value}`;
        });

        if (this._configFile.length > 1) {
            str += ` --config ${this._configFile}`;
        }

        if (this._context.length > 1) {
            str += ` --context ${this._context}`;
        }

        return str;
    }

    dryRun(): Promise<ShellResult> {
        return new Promise<ShellResult>((resolve) => {
            logger.log(this.toString());
            resolve({ code: 0, stdout: this.toString(), stderr: '' });
        });
    }

    stream(callback: ((proc: ChildProcess) => void)): Promise<ShellResult | undefined> {
        // When no working directory is provided the default dir is used
        const wd = (this.workingDir) ? this.workingDir : '.';

        const shellOpts = {
            env: process.env,
            async: true,
            cwd: wd,
            silent: this.isSilent()
        };

        return shell.execStreaming(this.toString(), callback, shellOpts);
    }

    run(): Promise<ShellResult | undefined> {
        // When no working directory is provided the default dir is used
        const wd = (this.workingDir) ? this.workingDir : '.';

        const shellOpts = {
            env: process.env,
            async: true,
            cwd: wd,
            silent: this.isSilent()
        };

        return shell.exec(this.toString(), shellOpts);
    }
}

export function getCurrentCommandConfig(): commandConfig {
    return {
        dryrun: vscode.workspace.getConfiguration('akkaserverless').get<boolean>('dryrun'),
        // The log output asks a positive question so the inverse should be used to determine the result
        silent: !vscode.workspace.getConfiguration('akkaserverless').get<boolean>('logOutput'),
        configFile: vscode.workspace.getConfiguration('akkaserverless').get<string>('configFile'),
        context: vscode.workspace.getConfiguration('akkaserverless').get<string>('context')
    };
}