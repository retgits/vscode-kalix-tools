import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { Member } from '../../datatypes/roles/member';
import { Convert } from '../../datatypes/converter';

export async function listMembers(projectID: string, shell: Shell): Promise<Member[]> {
    let command = new Command('akkasls roles list-bindings -o json', shell);
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});
    let result = await command.run();
    return Convert.toMemberArray(result!.stdout);
}