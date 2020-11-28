'use strict';

import { aslogger } from '../../../utils/logger';
import { ShellResult } from '../../../utils/shell';
import * as wrapper from '../../wrapper';
import * as config from './config';

export async function run(configpath?: string): Promise<ShellResult | null> {
    let asConfig = config.readConfigFile(configpath);

    let command = new wrapper.Command(`docker build . -t ${asConfig.InternalConfig.DockerImageUser}/${asConfig.Resources.Function.Name}`);
    command.setBaseDir(asConfig.InternalConfig.BaseDir);
    let result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }

    command = new wrapper.Command(`docker run -d --name ${asConfig.Resources.Function.Name} -p 8080:8080 ${asConfig.InternalConfig.DockerImageUser}/${asConfig.Resources.Function.Name}`);
    command.setBaseDir(asConfig.InternalConfig.BaseDir);
    result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }

    command = new wrapper.Command(`docker run -d --name ${asConfig.Resources.Function.Name}-proxy -p 9000:9000 --env USER_FUNCTION_HOST=${asConfig.Resources.Docker.Host} cloudstateio/cloudstate-proxy-dev-mode:latest`);
    command.setBaseDir(asConfig.InternalConfig.BaseDir);
    result = await command.runCommand();
    if (result?.stdout) {
        aslogger.log(result?.stdout);
    }

    return null;
}