'use strict';

import { ShellResult } from '../../../utils/shell';
import * as wrapper from '../../wrapper';

export async function run(tokenID?: string): Promise<ShellResult | null> {
    let command = new wrapper.Command('auth token revoke');

    if (tokenID) {
        command.addFlag({ name: 'token', description: 'ID of the token to revoke', required: true, defaultValue: tokenID, show: false });
    } else {
        command.addFlag({ name: 'token', description: 'ID of the token to revoke', required: true });
    }

    return command.runCommand();
}