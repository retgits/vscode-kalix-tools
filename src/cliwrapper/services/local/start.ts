'use strict';

import { aslogger } from '../../../utils/logger';
import { ShellResult } from '../../../utils/shell';
import { Command } from '../../wrapper';
import { ReadConfigFile } from './config';

export async function StartLocal(configpath?: string): Promise<ShellResult | null> {
    let asConfig = ReadConfigFile(configpath);

    let command = new Command(`docker build . -t ${asConfig.InternalConfig.DockerImageUser}/${asConfig.Resources.Function.Name}`);
    command.setBaseDir(asConfig.InternalConfig.BaseDir);
    command.addToolPrefix(false);
    let result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }

    command = new Command(`docker run -d --name ${asConfig.Resources.Function.Name} -p 8080:8080 ${asConfig.InternalConfig.DockerImageUser}/${asConfig.Resources.Function.Name}`);
    command.setBaseDir(asConfig.InternalConfig.BaseDir);
    command.addToolPrefix(false);
    result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }

    command = new Command(`docker run -d --name ${asConfig.Resources.Function.Name}-proxy -p 9000:9000 --env USER_FUNCTION_HOST=${asConfig.Resources.Docker.Host} cloudstateio/cloudstate-proxy-dev-mode:latest`);
    command.setBaseDir(asConfig.InternalConfig.BaseDir);
    command.addToolPrefix(false);
    result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }

    return null;
}