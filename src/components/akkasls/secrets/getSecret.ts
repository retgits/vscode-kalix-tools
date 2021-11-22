import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The get secret command shows the description of a specific secret in the current project.
 *
 * @param {string} projectID The ID of the project to get secret details for
 * @param {string} secret The name of the secret to get details for
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function getSecret(secret: string, projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls secrets get -o json');
    command.addParameter({ name: 'secret', value: secret, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}