import { Command } from '../../../../utils/shell/command';
import { Shell } from '../../../../utils/shell/shell';
import { ShellResult } from '../../../../utils/shell/datatypes';

export async function deleteInvite(projectID: string, emailAddress:string, shell: Shell): Promise<ShellResult> {
    let command = new Command('akkasls roles invitations delete', shell);
    command.addParameter({name: 'emailAddress', value: emailAddress, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});
    return await command.run();
}