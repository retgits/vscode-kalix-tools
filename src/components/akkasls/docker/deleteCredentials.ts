import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The deleteCredentials command removes a set of Docker credentials from the project.
 *
 * @export
 * @param {string} projectID the ID of the project to use
 * @param {string} credentialID the ID of the credential to remove
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function deleteCredentials(projectID: string, credentialID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls docker delete-credentials');
    command.addParameter({name: 'credentialID', value: credentialID, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}