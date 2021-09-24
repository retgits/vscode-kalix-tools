import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The redeploy command redeploys a service by pulling the newest image with the specified tag from the repository.
 *
 * @export
 * @param {string} service the name of the service to deploy
 * @param {string} projectID the ID of the project to deploy to
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function redeployService(service: string, projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls services redeploy');
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