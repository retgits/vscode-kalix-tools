// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * Log Level in order from least verbose to most
 */
export enum LogLevel {
    /** Only log error messages */
    ERROR = 1,
    /** Only log warnings and error messages */
    WARN = 2,
    /** Only log info, warnings and error messages */
    INFO = 3,
    /** Log everything */
    DEBUG = 4
}

export class Logger {
    /**
     * Logging level for service. Specified by 'verbose' or 'v' flag in Serverless Options.
     * Defaults to 'info'
     */
    private _logLevel: LogLevel;
    private _channel: vscode.OutputChannel;

    constructor(channelName: string) {
        this._channel = vscode.window.createOutputChannel(channelName);
        this._logLevel = LogLevel.INFO;
    }

    /**
     * Logs any message with a level (error, warn, info, debug) less than or equal
     * to the logging level set in the constructor (defaults to info)
     * @param message Message to log
     * @param logLevel Log Level
     */
    public log(message: string, logLevel: LogLevel = LogLevel.INFO): void {
        if (logLevel <= this._logLevel) {
            this._channel.appendLine(message.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
            this._channel.show(true);
        }
    }

    public error(message: string): void {
        this.log(`[ERROR] ${message}`, LogLevel.ERROR);
    }

    public warn(message: string): void {
        this.log(`[WARN] ${message}`, LogLevel.WARN);
    }

    public info(message: string): void {
        this.log(`[INFO] ${message}`, LogLevel.INFO);
    }

    public debug(message: string): void {
        this.log(`[DEBUG] ${message}`, LogLevel.DEBUG);
    }

    dispose(): void {
        this._channel.hide();
        this._channel.clear();
        this._channel.dispose();
    }
}

export const logger: Logger = new Logger('akkasls');