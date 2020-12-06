import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { ShellResult } from '../../../utils/shell/datatypes';

export async function deleteDockerCredentials(projectID: string, credentialID: string, shell: Shell): Promise<ShellResult> {
    let command = new Command('akkasls docker delete-credentials', shell);
    command.addParameter({name: 'credentialID', value: credentialID, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});
    return await command.run();
}