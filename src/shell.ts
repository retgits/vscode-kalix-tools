// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Standard node imports
import { ChildProcess } from 'child_process';

// External dependencies
import * as shelljs from 'shelljs';

/**
 * The OS enum determines which operating system the shell is used on
 */
enum OS {
    Windows,
    MacOS,
    Linux,
    Unsupported,  // shouldn't happen!
}

/**
 * The interface ShellResult encapsulates the result returned by the external command.
 * Both the standard output and standard error as well as the result code are returned.
 */
interface ShellResult {
    readonly code: number;
    readonly stdout: string;
    readonly stderr: string;
}

/**
 * The interface Shell describes the capabilities that the Shell has and are implemented by
 * the shell constant
 */
interface Shell {
    isWindows(): boolean;
    isUnix(): boolean;
    os(): OS;
    combinePath(basePath: string, relativePath: string): string;
    fileUri(filePath: string): vscode.Uri;
    execOpts(): any;
    exec(cmd: string, stdin?: string): Promise<ShellResult | undefined>;
    execStreaming(cmd: string, callback: ((proc: ChildProcess) => void) | undefined): Promise<ShellResult | undefined>;
    execCore(cmd: string, opts: any, callback?: (proc: ChildProcess) => void, stdin?: string): Promise<ShellResult>;
    which(bin: string): string | null;
}

/**
 * The shell is the main entry point for all commands that need to be executed
 */
export const shell: Shell = {
    isWindows: isWindows,
    isUnix: isUnix,
    os: os,
    combinePath: combinePath,
    fileUri: fileUri,
    execOpts: execOpts,
    exec: exec,
    execStreaming: execStreaming,
    execCore: execCore,
    which: which,
};

/**
 * The isWindows command checks whether the current OS is Windows
 * @returns {boolean} Whether the current Operating System is Windows
 */
function isWindows(): boolean {
    return (process.platform === 'win32');
}

/**
 * The isUnix command checks whether the current OS is Unix or a Unix derivative
 * @returns {boolean} Whether the current Operating System is Unix
 */
function isUnix(): boolean {
    return !isWindows();
}

/**
 * The os command checks which OS is currently used
 * @returns {OS} The current Operating System
 */
function os(): OS {
    switch (process.platform) {
        case 'win32': return OS.Windows;
        case 'darwin': return OS.MacOS;
        case 'linux': return OS.Linux;
        default: return OS.Unsupported;
    }
}

/**
 * The combinePath command creates a complete path to a specific item by combining the
 * base path and the relative path.
 *
 * @param {string} basePath The base path of the item
 * @param {string} relativePath The relative path to the item
 * @return {string} The new path
 */
function combinePath(basePath: string, relativePath: string): string {
    let separator = '/';
    if (isWindows()) {
        relativePath = relativePath.replace(/\//g, '\\');
        separator = '\\';
    }
    return basePath + separator + relativePath;
}

/**
 * The isWindowsFilePath command checks whether a filePath string is using Windows separators
 *
 * @param {string} filePath The filePath to validate
 * @return {boolean} Whether the passed in filePath is Windows based or not
 */
function isWindowsFilePath(filePath: string): boolean {
    return filePath[1] === ':' && filePath[2] === '\\';
}

/**
 * The fileUri command turns a filePath into a vscode.Uri object
 *
 * @param {string} filePath The path to convert
 * @return {vscode.Uri} A vscode.Uri object
 */
function fileUri(filePath: string): vscode.Uri {
    if (isWindowsFilePath(filePath)) {
        return vscode.Uri.parse('file:///' + filePath.replace(/\\/g, '/'));
    }
    return vscode.Uri.parse('file://' + filePath);
}

/**
 * The execOpts command returns a default set of execution options for the shell
 *
 * @return {*} The default set of execution options
 */
function execOpts(): any {
    const opts = {
        env: process.env,
        async: true
    };
    return opts;
}

/**
 * The exec command runs the command passed in and returns a ShellResult
 *
 * @param {string} cmd The command to execute
 * @return {(Promise<ShellResult | undefined>)} A ShellResult or undefined when an error occurs
 */
async function exec(cmd: string): Promise<ShellResult | undefined> {
    try {
        return await execCore(cmd, execOpts(), null);
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}

/**
 * The execStreaming command runs the command passed in asynchronously and sends data back to the callback function provided.
 *
 * @param {string} cmd The command to execute
 * @param {(proc: ChildProcess) => void} callback The function that handles data from the executed process
 * @return {(Promise<ShellResult | undefined>)} A ShellResult or undefined when an error occurs
 */
async function execStreaming(cmd: string, callback: (proc: ChildProcess) => void): Promise<ShellResult | undefined> {
    console.log(cmd);
    try {
        return await execCore(cmd, execOpts(), callback);
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}

/**
 * The execCore command handles the actual execution of commands for the exec and execStreaming commands.
 *
 * @param {string} cmd The command to execute
 * @param {*} opts The execution options to pass in
 * @param {(((proc: ChildProcess) => void) | null)} [callback] The function that handles data from the executed process
 * @return {Promise<ShellResult>} A ShellResult
 */
function execCore(cmd: string, opts: any, callback?: ((proc: ChildProcess) => void) | null): Promise<ShellResult> {
    return new Promise<ShellResult>((resolve) => {
        const proc = shelljs.exec(cmd, opts, (code, stdout, stderr) => resolve({code : code, stdout : stdout, stderr : stderr}));
        if (callback) {
            callback(proc);
        }
    });
}

/**
 * The which command searches in the system's PATH. On Windows looks for .exe, .cmd, and .bat extensions.
 *
 * @param {string} bin The binary to search for.
 * @return {(string | null)} String containing the absolute path to the command or null when the command doesn't exist
 */
function which(bin: string): string | null {
    return shelljs.which(bin);
}