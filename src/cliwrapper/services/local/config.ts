import * as fs from 'fs';
import * as path from 'path';
import * as URL from 'url';
import * as vscode from 'vscode';
import * as jsyaml from 'js-yaml';
import * as localService from '../../../datatypes/services/local';

// Get the path of the .akkaserverless.yaml file. The precedence is:
// 1. Selected through the VS Code context menu (configFilePath exists)
// 2. The current active text editor window in VS Code is called .akkaserverless.yaml
// 3. Check the current open workspace for a .akkaserverless.yaml
// 4. Chec the current open folder for a  .akkaserverless.yaml
// If no file can be found, an error is thrown
function getConfigFilePath(configpath?: string): string {
    if (configpath) {
        return configpath;
    }

    if (vscode.window.activeTextEditor?.document.fileName) {
        if (vscode.window.activeTextEditor!.document.fileName.endsWith('.akkaserverless.yaml')) {
            return vscode.window.activeTextEditor!.document.fileName;
        }
    }

    if (vscode.workspace.workspaceFolders !== undefined) {
        let dir: string = URL.fileURLToPath(vscode.workspace.workspaceFolders![0].uri.toString());
        let configpath = path.join(dir, '.akkaserverless.yaml');
        if (fs.existsSync(configpath)) {
            return configpath;
        }
    }

    let dir = '.';
    configpath = path.join(dir, '.akkaserverless.yaml');

    if (!fs.existsSync(configpath)) {
        throw new Error(`Config file .akkaserverless.yaml does not exist in ${dir}`);
    }

    return configpath;
}

export function readConfigFile(configpath?: string): localService.ASConfig {
    configpath = getConfigFilePath(configpath);
    let basedir = path.dirname(configpath);

    let asConfig = localService.Convert.toASConfig(JSON.stringify(jsyaml.safeLoad(fs.readFileSync(configpath, 'utf-8'))));
    
    if (vscode.workspace.getConfiguration('akkaserverless').get('dockerImageUser')) {
        let dockerImageUser = vscode.workspace.getConfiguration('akkaserverless')!.get<string>('dockerImageUser')!;
        asConfig.InternalConfig = {
            BaseDir: basedir,
            DockerImageUser: dockerImageUser
        };
    }

    return asConfig;
}