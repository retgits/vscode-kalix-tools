import { Command } from '../../../../utils/shell/command';
import { Shell } from '../../../../utils/shell/shell';
import { Invite } from '../../../datatypes/roles/invitations/invite';
import { Convert } from '../../../datatypes/converter';

export async function listInvites(projectID: string, shell: Shell): Promise<Invite[]> {
    let command = new Command('akkasls roles invitations list -o json', shell);
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});
    let result = await command.run();
    return Convert.toInviteArray(result!.stdout);
}