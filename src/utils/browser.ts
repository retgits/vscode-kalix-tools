import * as vscode from 'vscode';

/**
 * The openBrowser command opens a browser window with the specified URL.
 * @param url The URL to open
 */
export function openBrowser(url: string) {
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
}