import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The listCredentials command lists all the container registry credentials set for the project. (passwords are not displayed)
 *
 * @export
 * @param {string} projectID the ID of the project to use
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function listCredentials(projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls docker list-credentials -o json');
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}