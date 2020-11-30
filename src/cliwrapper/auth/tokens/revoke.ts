'use strict';

import { ShellResult } from '../../../utils/shell';
import * as akkasls from '../../../akkasls';
import * as wrapper from '../../wrapper';
import { window } from 'vscode';

export async function run(akkasls: akkasls.AkkaServerless, tokenID?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('auth tokens revoke');

    if(!tokenID) {
        tokenID = await window.showQuickPick(akkasls.getTokenArray(), {
            placeHolder: 'Pick your token to revoke...'
        });
    }

    command.addArgument({ name: 'token', description: 'ID of the token to revoke', defaultValue: tokenID, show: false });

    return command.runCommand();
}