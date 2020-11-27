'use strict';

import { ShellResult } from '../../utils/shell';
import * as wrapper from '../wrapper';

export async function run(): Promise<ShellResult | null> {
    let command = new wrapper.Command('auth login');
    command.addArgument({name: 'additional flags', description: 'any additional flags you want to add'});
    return command.runCommand();
}