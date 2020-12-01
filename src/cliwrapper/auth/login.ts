'use strict';

import { ShellResult } from '../../utils/shell';
import { Command } from '../wrapper';

export async function Login(): Promise<ShellResult | null> {
    let command = new Command('auth login');
    command.addArgument({name: 'additional flags', description: 'any additional flags you want to add'});
    return command.runCommand();
}