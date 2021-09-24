import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The exposeService command creates a route to expose a service for inbound traffic. You may optionally enable HTTP CORS with the `--enable-cors` flag
 *
 * @param {string} service The name of the service to expose
 * @param {string} flags The flags for the operation
 * @param {string} projectID The ID of the project to expose the service in
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function exposeService(service: string, flags: string, projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls services expose');
    command.addParameter({ name: 'service', value: service, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });
    command.addParameter({ name: 'flags', value: flags, addNameToCommand: false });

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return await command.run();
}