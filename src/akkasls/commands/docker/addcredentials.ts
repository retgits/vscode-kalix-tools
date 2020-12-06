import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { ShellResult } from '../../../utils/shell/datatypes';

export async function addDockerCredentials(projectID: string, credentials: string, shell: Shell): Promise<ShellResult> {
    let command = new Command('akkasls docker add-credentials', shell);
    command.addParameter({name: 'credentials', value: credentials, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});
    return await command.run();
}