import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The listServices command lists all services in a project
 *
 * @param {string} projectID The ID of the project to list services for
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function listServices(projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls services list -o json');
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}