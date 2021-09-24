import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The deleteInvite command deletes an invitation from a project
 *
 * @export
 * @param {string} projectID the ID of the project to delete the invite from
 * @param {string} emailAddress the email address to the delete the invite for
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function deleteInvite(projectID: string, emailAddress: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls roles invitations delete');
    command.addParameter({name: 'emailAddress', value: emailAddress, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}