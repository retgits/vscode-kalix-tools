import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The listInvites command lists all invitations to a project
 *
 * @export
 * @param {string} projectID the ID of the project to list invites for
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function listInvites(projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls roles invitations list -o json');
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}