'use strict';

import { ShellResult } from '../../utils/shell';
import { Command } from '../wrapper';

export async function CurrentLogin(): Promise<ShellResult | null> {
    let command = new Command('auth current-login');
    return command.runCommand();
}