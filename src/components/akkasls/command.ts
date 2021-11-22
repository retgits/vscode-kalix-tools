/*global process*/
import { shell, ShellResult } from '../shell/shell';
import { ChildProcess } from 'child_process';

/**
 * An interface for global flags of `akkasls`
 *  * `dryrun`: print the command but do not execute it
 *  * `silent`: do not print any intermediate output and only return the result
 *  * `configFile`: the config file to use (default "~/.akkaserverless/config.yaml")
 *  * `context`: the configutation context to use
 *
 * @export
 * @interface GlobalFlags
 */
export interface GlobalFlags {
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
 *
 * @export
 * @interface Parameter
 */
export interface Parameter {
    name: string;
    value: string;
    addNameToCommand: boolean;
}

/**
 * An interface for flags of `akkasls services logs`
 *  * `followLogs`: whether logs should be followed
 *  * `instanceLogs`: whether instance logs should be included
 *  * `lifecycleLogs`: whether lifecycle logs should be included
 *  * `tailLines`: the maximum number of lines to fetch
 *
 * @export
 * @interface LogTypes
 */
export interface LogTypes {
    followLogs?: boolean;
    instanceLogs?: boolean;
    lifecycleLogs?: boolean;
    tailLines?: number;
    callback?: ((proc: ChildProcess) => void);
}

/**
 * EnvVars represent environment variables in `akkasls service` commands by defining key/value pairs
 * @export
 * @interface EnvVars
 */
export interface EnvVars {
    [command: string]: string
}

/**
 * LiteralSecret represent secret data in `akkasls secrets` commands by defining key/value pairs
 * @export
 * @interface LiteralSecret
 */
export interface LiteralSecret {
    [command: string]: string
}

/**
 * Command encapsulates all the commands that need to be run
 *
 * @export
 * @class Command
 */
export class Command {
    public readonly command: string;
    public readonly workingDir?: string;
    private _parameters: Parameter[] = [];
    private _silent = false;
    private _configFile = '';
    private _context = '';

    /**
     * Creates an instance of Command.
     * 
     * @param {string} command the command to execute
     * @param {string} [workingDir] an optional working directory
     * @memberof Command
     */
    constructor(command: string, workingDir?: string) {
        this.command = command;
        this.workingDir = workingDir;
    }

    /**
     * Add a parameter to the command
     *
     * @param {Parameter} p parameter to add
     * @memberof Command
     */
    addParameter(p: Parameter): void {
        this._parameters.push({
            name: p.name,
            value: p.value,
            addNameToCommand: p.addNameToCommand
        });
    }

    /**
     * Sets the command to silent (does not print to stdout)
     *
     * @param {(boolean | undefined)} value
     * @memberof Command
     */
    setSilent(value: boolean | undefined): void {
        if (value) {
            this._silent = value;
        }
    }

    /**
     * Sets the config file to use for `akkasls`
     *
     * @param {(string | undefined)} value
     * @memberof Command
     */
    setConfigFile(value: string | undefined): void {
        if (value) {
            this._configFile = value;
        }
    }

    /**
     * Sets the context to use for `akkasls`
     *
     * @param {(string | undefined)} value
     * @memberof Command
     */
    setContext(value: string | undefined): void {
        if (value) {
            this._context = value;
        }
    }

    /**
     * Returns a string representation of the command
     *
     * @return {*}  {string}
     * @memberof Command
     */
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

        str += ' --disable-prompt';

        return str;
    }

    /**
     * Returns the string representation of the command and result code 0
     *
     * @return {*}  {Promise<ShellResult>}
     * @memberof Command
     */
    dryRun(): Promise<ShellResult> {
        return new Promise<ShellResult>((resolve) => {
            resolve({ code: undefined, stdout: this.toString(), stderr: '' });
        });
    }

    getShellOpts(): any {
        // When no working directory is provided the default dir is used
        const wd = (this.workingDir) ? this.workingDir : '.';

        return {
            env: process.env,
            async: true,
            cwd: wd,
            silent: this._silent,
            stdio: null
        };
    }

    /**
     * Stream returns the output as a stream to the callback function
     *
     * @param {((proc: ChildProcess) => void)} callback the callback to return data to
     * @return {*}  {Promise<ShellResult>} the result
     * @memberof Command
     */
    stream(callback: ((proc: ChildProcess) => void)): Promise<ShellResult> {
        return shell.execStreaming(this.toString(), callback, this.getShellOpts());
    }

    /**
     * Executes the command
     *
     * @return {*}  {Promise<ShellResult>} the result of the command
     * @memberof Command
     */
    run(): Promise<ShellResult> {
        return shell.exec(this.toString(), this.getShellOpts());
    }
}