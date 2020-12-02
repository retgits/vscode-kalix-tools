'use strict';

import { aslogger } from '../../../utils/logger';
import { ShellResult } from '../../../utils/shell';
import { Command } from '../../wrapper';
import { ReadConfigFile } from './config';

export async function StopLocal(configpath?: string): Promise<ShellResult | null> {
    let asConfig = ReadConfigFile(configpath);

    let command = new Command(`docker stop ${asConfig.Resources.Function.Name}`);
    command.addToolPrefix(false);
    let result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }
    
    command = new Command(`docker rm ${asConfig.Resources.Function.Name}`);
    command.addToolPrefix(false);
    result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }
    
    command = new Command(`docker stop ${asConfig.Resources.Function.Name}-proxy`);
    command.addToolPrefix(false);
    result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }
    
    command = new Command(`docker rm ${asConfig.Resources.Function.Name}-proxy`);
    command.addToolPrefix(false);
    result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }

    return null;
}