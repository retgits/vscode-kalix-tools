import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The get service command shows the description of a specific service in the current project.
 *
 * @param {string} projectID The ID of the project to get service details for
 * @param {string} service The ID of the service to get details for
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function getService(service: string, projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls services get -o json');
    command.addParameter({ name: 'service', value: service, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}