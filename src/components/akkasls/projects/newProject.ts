import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The newProject command will create a new project in your Akka Serverless account
 *
 * @export
 * @param {string} name the name for your new project
 * @param {string} description the description for your new project
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function newProject(name: string, description: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls projects new');
    command.addParameter({name: 'name', value: name, addNameToCommand: false});
    command.addParameter({name: 'description', value: `"${description}"`, addNameToCommand: false});
    command.addParameter({name: 'region', value: 'us-east1', addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}