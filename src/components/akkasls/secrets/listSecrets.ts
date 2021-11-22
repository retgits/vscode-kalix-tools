import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The listSecrets command lists all secrets in a project
 *
 * @param {string} projectID The ID of the project to list secrets for
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function listSecrets(projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls secrets list -o json');
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}