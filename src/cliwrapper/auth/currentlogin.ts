'use strict';

import { ShellResult } from '../../utils/shell';
import * as wrapper from '../wrapper';

export async function run(): Promise<ShellResult | null> {
    let command = new wrapper.Command('auth current-login');
    return command.runCommand();
}