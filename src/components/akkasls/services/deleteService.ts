import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';


/**
 * The deleteService command deletes a service from your Akka Serverless account
 *
 * @param {string} service The name of the service to delete
 * @param {string} projectID The ID of the project to delete the service from
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function deleteService(service: string, projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls services undeploy');
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