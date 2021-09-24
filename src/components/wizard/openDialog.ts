import * as vscode from 'vscode';

export interface OpenDialogOptions {
    canSelectFiles: boolean,
    canSelectFolders: boolean,
    canSelectMany: boolean,
    title: string
}

export async function showOpenDialog(i: OpenDialogOptions): Promise<vscode.Uri[] | undefined> {
    return vscode.window.showOpenDialog({
        canSelectFiles: i.canSelectFiles,
        canSelectFolders: i.canSelectFolders,
        canSelectMany: i.canSelectMany,
        openLabel: 'Select',
        title: i.title,
    });
}