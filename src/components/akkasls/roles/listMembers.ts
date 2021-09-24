import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The listMembers command lists all members to a project
 *
 * @export
 * @param {string} projectID the ID of the project to list members for
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function listMembers(projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls roles list-bindings -o json');
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}