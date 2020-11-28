'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Standard node imports
import * as URL from 'url';

// External dependencies
import * as shelljs from 'shelljs';

// Set the execPath specifically to node due to a bug in shelljs
// https://github.com/shelljs/shelljs/issues/704
shelljs.config.execPath = shelljs.which('node').toString();

export interface ShellResult {
    readonly code: number;
    readonly stdout: string;
    readonly stderr: string;
}

/**
 * Interface Shell describes the required capabilities of the Shell commands
 */
export interface Shell {
    exec(cmd: string, cwd?: string): Promise<ShellResult>;
    existsInPath(tool: string): boolean;
}

/**
 * Shell is the default implementation of the Shell interface
 */
export const shell: Shell = {
    exec: exec,
    existsInPath: existsInPath
};

/**
 * existsInPath validates that a given executable exists in the PATH of the user
 * @param tool the executable to check
 */
function existsInPath(tool: string): boolean {
    if (shelljs.which(tool)) {
        return true;
    }
    return false;
}

/**
 * exec executes the command asynchronous
 * @param cmd The command to execute
 * @param cwd The directory to start from
 */
function exec(cmd: string, cwd?: string) {
    let wd: string;

    if (!cwd && !vscode.workspace.workspaceFolders) {
        wd = '.';
    } else {
        wd = (cwd) ? cwd : URL.fileURLToPath(vscode.workspace.workspaceFolders![0].uri.toString());
    }

    let opts = { 
        env: process.env,
        async: true,
        cwd: wd
    };

    return new Promise<ShellResult>((resolve) => {
        shelljs.exec(cmd, opts, (code, stdout, stderr) => resolve({code : code, stdout : stdout, stderr : stderr}));
    });
}