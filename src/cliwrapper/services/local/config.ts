import { existsSync, readFileSync } from 'fs-extra';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { window, workspace } from 'vscode';
import { safeLoad } from 'js-yaml';
import { Convert } from '../../../datatypes/converter';
import { ASConfig } from '../../../datatypes/services/local';

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

    if (window.activeTextEditor?.document.fileName) {
        if (window.activeTextEditor!.document.fileName.endsWith('.akkaserverless.yaml')) {
            return window.activeTextEditor!.document.fileName;
        }
    }

    if (workspace.workspaceFolders !== undefined) {
        let dir: string = fileURLToPath(workspace.workspaceFolders![0].uri.toString());
        let configpath = join(dir, '.akkaserverless.yaml');
        if (existsSync(configpath)) {
            return configpath;
        }
    }

    let dir = '.';
    configpath = join(dir, '.akkaserverless.yaml');

    if (!existsSync(configpath)) {
        throw new Error(`Config file .akkaserverless.yaml does not exist in ${dir}`);
    }

    return configpath;
}

export function ReadConfigFile(configpath?: string): ASConfig {
    configpath = getConfigFilePath(configpath);
    let basedir = dirname(configpath);

    let asConfig = Convert.toASConfig(JSON.stringify(safeLoad(readFileSync(configpath, 'utf-8'))));
    
    if (workspace.getConfiguration('akkaserverless').get('dockerImageUser')) {
        let dockerImageUser = workspace.getConfiguration('akkaserverless')!.get<string>('dockerImageUser')!;
        asConfig.InternalConfig = {
            BaseDir: basedir,
            DockerImageUser: dockerImageUser
        };
    }

    return asConfig;
}