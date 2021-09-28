/*global process, console*/
import execSh from 'exec-sh';
import { ChildProcess } from 'child_process';

/**
 * Enumeration of operating systems
 */
enum OS {
    windows,
    macOS,
    linux,
    unsupported,
}

/**
 * The interface ShellResult encapsulates the result returned by the external command.
 * The result will always have a result code and optionally have stdout and stderr.
 *
 * @export
 */
export interface ShellResult {
    readonly code?: string;
    readonly stdout?: string;
    readonly stderr?: string;
}

/**
 * The interface Shell describes the capabilities that the Shell has and are implemented by the shell constant
 */
interface Shell {
    isWindows(): boolean;
    isUnix(): boolean;
    isSupported(): boolean;
    os(): OS;
    execOpts(): any;
    exec(cmd: string, opts?: any): Promise<ShellResult>;
    execStreaming(cmd: string, callback: ((proc: ChildProcess) => void) | undefined, opts?: any): Promise<ShellResult>;
    execCore(cmd: string, opts: any, callback?: (proc: ChildProcess) => void, stdin?: string): Promise<ShellResult>;
    which(bin: string): Promise<string | null>;
}

/**
 * The shell is the main entry point for all commands that need to be executed
 */
export const shell: Shell = {
    isWindows: isWindows,
    isUnix: isUnix,
    isSupported: isSupported,
    os: os,
    execOpts: execOpts,
    exec: exec,
    execStreaming: execStreaming,
    execCore: execCore,
    which: which,
};

/**
 * The isWindows command checks whether the current OS is Windows
 * 
 * @returns {boolean} Whether the current Operating System is Windows
 */
function isWindows(): boolean {
    return (process.platform === 'win32');
}

/**
 * The isUnix command checks whether the current OS is Unix or a Unix derivative (macOS)
 * 
 * @returns {boolean} Whether the current Operating System is Unix
 */
function isUnix(): boolean {
    return !isWindows();
}

/**
 * The isSupported checks whether the current OS is supported or not
 *
 * @return {*}  {boolean} Whether the current Operating System is supported
 */
function isSupported(): boolean {
    if (os() === OS.unsupported) {
        return false;
    }

    return true;
}

/**
 * The os command checks which OS is currently used
 * 
 * @returns {OS} The current Operating System
 */
function os(): OS {
    switch (process.platform) {
        case 'win32': return OS.windows;
        case 'darwin': return OS.macOS;
        case 'linux': return OS.linux;
        default: return OS.unsupported;
    }
}

/**
 * The execOpts command returns a default set of execution options for the shell
 *
 * @return {*} The default set of execution options
 */
function execOpts(): any {
    const opts = {
        env: process.env,
        async: true,
        stdio: null
    };
    return opts;
}

/**
 * The exec command runs the command passed in and returns a ShellResult
 *
 * @param {string} cmd The command to execute
 * @param {*} [opts] The execution options to pass in (if none are provided, the default is used)
 * @return {*}  {Promise<ShellResult>} A ShellResult (with code '-1' when an error occurs)
 */
async function exec(cmd: string, opts?: any): Promise<ShellResult> {
    try {
        if (opts) {
            return await execCore(cmd, opts, null);
        }
        return await execCore(cmd, execOpts(), null);
    } catch (ex: any) {
        return {
            code: '-1',
            stderr: ex
        };
    }
}

/**
 * The execStreaming command runs the command passed in asynchronously and sends data back to the callback function provided.
 *
 * @param {string} cmd The command to execute
 * @param {(proc: ChildProcess) => void} callback The function that handles data from the executed process
 * @return {*}  {Promise<ShellResult>} A ShellResult (with code '-1' when an error occurs)
 */
async function execStreaming(cmd: string, callback: (proc: ChildProcess) => void, opts?: any): Promise<ShellResult> {
    console.log(cmd);
    try {
        if (opts) {
            return await execCore(cmd, opts, callback);
        }
        return await execCore(cmd, execOpts(), callback);
    } catch (ex: any) {
        return {
            code: '-1',
            stderr: ex
        };
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
        const proc = execSh(cmd, opts, (code, stdout, stderr) => resolve({code : code?.message, stdout : stdout, stderr : stderr}));
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
async function which(bin: string): Promise<string | null> {
    let res: ShellResult;

    if (isWindows()) {
        res = await exec(`where ${bin}`);
    } else {
        res = await exec(`which ${bin}`);
    }
    
    if (res.code === undefined) {
        return res.stdout!;
    }

    return null;
}