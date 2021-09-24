import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * This command will delete the project
 *
 * @export
 * @param {string} projectID the project to delete
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function deleteProject(projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls projects delete');
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}