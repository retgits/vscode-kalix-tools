import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The addInvite command invites a user to a project
 *
 * @export
 * @param {string} projectID the ID of the project to invite the user to
 * @param {string} emailAddress the email address of the user to invite
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function addInvite(projectID: string, emailAddress: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls roles invitations invite-user');
    command.addParameter({name: 'emailAddress', value: emailAddress, addNameToCommand: false});
    command.addParameter({name: 'role', value: 'admin', addNameToCommand: true});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}