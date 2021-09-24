import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The unexposeService removes a route from your service
 *
 * @param {string} service The name of the service to remove a route from
 * @param {string} hostname The name of the route to remove
 * @param {string} projectID The ID of the project in which the service resides
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function unexposeService(service: string, hostname: string, projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls services unexpose');
    command.addParameter({ name: 'service', value: service, addNameToCommand: false });
    command.addParameter({ name: 'hostname', value: hostname, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}