import * as fs from 'fs';
import * as path from 'path';
import * as jsyaml from 'js-yaml';
import * as vscode from 'vscode';
import * as URL from 'url';
import * as config from './config';
import { shell } from '../shell';
import { aslogger } from '../logger';

function getConfigFilePath(): string {
    if (vscode.window.activeTextEditor?.document.fileName) {
        if (vscode.window.activeTextEditor!.document.fileName.endsWith('.akkaserverless.yaml')) {
            return vscode.window.activeTextEditor!.document.fileName;
        }
    }

    let wd;
    if (!vscode.workspace.workspaceFolders) {
        wd = '.';
    } else {
        wd = URL.fileURLToPath(vscode.workspace.workspaceFolders![0].uri.toString());
    }

    let configPath = path.join(wd, '.akkaserverless.yaml');

    if (!fs.existsSync(configPath)) {
        throw new Error(`Config file .akkaserverless.yaml does not exist in ${wd}`);
    }

    return configPath;
}

export async function start(configpath?: string) {
    let configFilePath = (configpath) ? configpath : getConfigFilePath();
    let asConfig = config.Convert.toASConfig(JSON.stringify(jsyaml.safeLoad(fs.readFileSync(configFilePath, 'utf-8'))));
    let basedir = path.dirname(configFilePath);
    let res = await shell.exec(`docker build . -t ${asConfig.Resources.Docker.Registry}/${asConfig.Resources.Docker.Username}/${asConfig.Resources.Function.Name}`, basedir);
    aslogger.log(res.stdout);
    res = await shell.exec(`docker run -d --name ${asConfig.Resources.Function.Name} -p 8080:8080 ${asConfig.Resources.Docker.Registry}/${asConfig.Resources.Docker.Username}/${asConfig.Resources.Function.Name}`, basedir);
    aslogger.log(res.stdout);
    res = await shell.exec(`docker run -d --name ${asConfig.Resources.Function.Name}-proxy -p 9000:9000 --env USER_FUNCTION_HOST=${asConfig.Resources.Docker.Overrides!.Host} cloudstateio/cloudstate-proxy-dev-mode:latest`, basedir);
    aslogger.log(res.stdout);
}

export async function stop(configpath?: string) {
    let configFilePath = (configpath) ? configpath : getConfigFilePath();
    let asConfig = config.Convert.toASConfig(JSON.stringify(jsyaml.safeLoad(fs.readFileSync(configFilePath, 'utf-8'))));

    let res = await shell.exec(`docker stop ${asConfig.Resources.Function.Name}`);
    aslogger.log(res.stdout);
    res = await shell.exec(`docker rm ${asConfig.Resources.Function.Name}`);
    aslogger.log(res.stdout);
    res = await shell.exec(`docker stop ${asConfig.Resources.Function.Name}-proxy`);
    aslogger.log(res.stdout);
    res = await shell.exec(`docker rm ${asConfig.Resources.Function.Name}-proxy`);
    aslogger.log(res.stdout);
}