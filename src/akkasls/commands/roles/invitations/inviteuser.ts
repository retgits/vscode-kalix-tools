import { Command } from '../../../../utils/shell/command';
import { Shell } from '../../../../utils/shell/shell';
import { ShellResult } from '../../../../utils/shell/datatypes';

export async function addInvite(projectID: string, emailAddress:string, shell: Shell): Promise<ShellResult> {
    let command = new Command('akkasls roles invitations invite-user', shell);
    command.addParameter({name: 'role', value: 'admin', addNameToCommand: true});
    command.addParameter({name: 'emailAddress', value: emailAddress, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});
    return await command.run();
}