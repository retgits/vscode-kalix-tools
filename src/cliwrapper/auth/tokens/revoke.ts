'use strict';

import { ShellResult } from '../../../utils/shell';
import { AkkaServerless } from '../../../akkasls';
import { Command } from '../../wrapper';
import { window } from 'vscode';

export async function RevokeToken(akkasls: AkkaServerless, tokenID?: string): Promise<ShellResult | null> {
    let command = new Command('auth tokens revoke');

    if(!tokenID) {
        tokenID = await window.showQuickPick(akkasls.getTokenArray(), {
            placeHolder: 'Pick your token to revoke...'
        });
    }

    command.addArgument({ name: 'token', description: 'ID of the token to revoke', defaultValue: tokenID, show: false });

    return command.runCommand();
}