'use strict';

import { aslogger } from '../../../utils/logger';
import { ShellResult } from '../../../utils/shell';
import * as wrapper from '../../wrapper';
import * as config from './config';

export async function run(configpath?: string): Promise<ShellResult | null> {
    let asConfig = config.readConfigFile(configpath);

    let command = new wrapper.Command(`docker stop ${asConfig.Resources.Function.Name}`);
    let result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }
    
    command = new wrapper.Command(`docker rm ${asConfig.Resources.Function.Name}`);
    result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }
    
    command = new wrapper.Command(`docker stop ${asConfig.Resources.Function.Name}-proxy`);
    result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }
    
    command = new wrapper.Command(`docker rm ${asConfig.Resources.Function.Name}-proxy`);
    result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }

    return null;
}