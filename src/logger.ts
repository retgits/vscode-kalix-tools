// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**
 * The Logger class implements all log capabilities
 *
 * @export
 * @class Logger
 */
export class Logger {
    private readonly _channel: vscode.OutputChannel = vscode.window.createOutputChannel("Akka Serverless");

    /**
     * Logs any message
     * @param message Message to log
     * @param title optional title
     */
    public log(message: string, title?: string): void {
        if (title) {
            const hightlightingTitle = `[${title}]\n`;
            this._channel.appendLine(hightlightingTitle);
        }
        this._channel.appendLine(message);
        this._channel.show();
    }

    /**
     * The dispose command hides, clears, and disposes of the output channel
     *
     * @memberof Logger
     */
    dispose(): void {
        this._channel.hide();
        this._channel.clear();
        this._channel.dispose();
    }
}

/**
 * logger is an instance of the Logger class
 */
export const logger: Logger = new Logger();