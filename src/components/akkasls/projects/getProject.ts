import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * Get information about a specific project
 *
 * @export
 * @param {string} projectID the project ID to get data for
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function getProject(projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls projects get -o json');
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}