// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Standard node imports

// External dependencies

// Internal dependencies

export function openBrowser(url: string) {
    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(url));
}