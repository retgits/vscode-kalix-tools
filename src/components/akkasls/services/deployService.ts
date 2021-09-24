import { Command, GlobalFlags, EnvVars} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The deployService command deploys a service to your Akka Serverless project
 *
 * @export
 * @param {string} service the name of the service to deploy
 * @param {string} image the container image to deploy
 * @param {string} projectID the ID of the project to deploy to
 * @param {EnvVars} ev the environment variables to use
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function deployService(service: string, image: string, projectID: string, ev: EnvVars, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls services deploy');
    command.addParameter({ name: 'service', value: service, addNameToCommand: false });
    command.addParameter({ name: 'image', value: image, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

    if (Object.keys(ev).length > 0) {
        let envString = [];
        let vars = Object.entries(ev);
        for (let index = 0; index < vars.length; index++) {
            const element = vars[index];
            envString.push(`${element[0]}=${element[1]}`);
        }
        command.addParameter({ name: 'env', value: envString.join(','), addNameToCommand: true });
    }

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}