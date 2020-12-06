import * as datatypes from './datatypes';
import * as shelljs from 'shelljs';
import { workspace } from 'vscode';
import { aslogger } from '../logger';

// Set the execPath specifically to node due to a bug in shelljs
// https://github.com/shelljs/shelljs/issues/704
shelljs.config.execPath = shelljs.which('node').toString();

export interface Shell {
    exec(cmd: string, cwd?: string): Promise<datatypes.ShellResult>;
    existsInPath(tool: string): boolean;
}

export const shell: Shell = {
    exec: exec,
    existsInPath: existsInPath
};

function existsInPath(tool: string): boolean {
    if (shelljs.which(tool)) {
        return true;
    }
    return false;
}

function exec(cmd: string, cwd?: string): Promise<datatypes.ShellResult> {
    let wd = (cwd) ? cwd : '.';

    let opts = { 
        env: process.env,
        async: true,
        cwd: wd
    };

    if (workspace.getConfiguration('akkaserverless').get<boolean>('dryrun')) {
        aslogger.log(cmd);
        return new Promise<datatypes.ShellResult>((resolve) => {
            resolve({ code: 0, stdout: '', stderr: '' });
        });
    }

    let configFile = workspace.getConfiguration('akkaserverless').get<string>('configFile');
    if (configFile) {
        cmd = `${cmd} --config ${configFile}`;
    }

    let context = workspace.getConfiguration('akkaserverless').get<string>('context');
    if (context) {
        cmd = `${cmd} --config ${context}`;
    }

    return new Promise<datatypes.ShellResult>((resolve) => {
        shelljs.exec(cmd, opts, (code, stdout, stderr) => {
            if (workspace.getConfiguration('akkaserverless').get<boolean>('logOutput')) {
                aslogger.log(stdout);
            }
            resolve({code : code, stdout : stdout, stderr : stderr});
        });
    });
}