import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';


/**
 * The deleteSecret command deletes a secret from the currently configured project.
 *
 * @param {string} secret The name of the secret to delete
 * @param {string} projectID The ID of the project to delete the secret from
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function deleteSecret(secret: string, projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls secrets delete');
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