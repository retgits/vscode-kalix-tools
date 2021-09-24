import * as vscode from 'vscode';

/**
 * Gets the current configuration of the Akka Serverless extension
 *
 * @export
 * @return {*}
 */
export function getConfiguration(): any {
    return {
        dryrun: vscode.workspace.getConfiguration('akkaserverless').get<boolean>('dryrun'),
        silent: vscode.workspace.getConfiguration('akkaserverless').get<boolean>('quiet'),
        configFile: vscode.workspace.getConfiguration('akkaserverless').get<string>('configFile'),
        context: vscode.workspace.getConfiguration('akkaserverless').get<string>('context')
    };
}