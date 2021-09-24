import * as vscode from 'vscode';

/**
 * Check whether experimental features are enabled
 *
 * @export
 * @return {*}  {(boolean | undefined)}
 */
export function isExperimentalEnabled(): boolean | undefined {
    return vscode.workspace.getConfiguration('akkaserverless').get<boolean>('enableExperimentalFeatures');
}
