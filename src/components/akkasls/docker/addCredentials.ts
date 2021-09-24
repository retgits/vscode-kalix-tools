import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The addCredentials command adds a set of docker credentials to the project.
 *
 * @export
 * @param {string} projectID the ID of the project to use
 * @param {string} credentials the string containing credentials and server URL
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function addCredentials(projectID: string, credentials: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls docker add-credentials');
    command.addParameter({name: 'credentials', value: credentials, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}