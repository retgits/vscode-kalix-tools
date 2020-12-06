import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { Credential } from '../../datatypes/docker/credentials';
import { Convert } from '../../datatypes/converter';

export async function listDockerCredentials(projectID:string, shell: Shell): Promise<Credential[]> {
    let command = new Command('akkasls docker list-credentials -o json', shell);
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});
    let result = await command.run();
    return Convert.toCredentials(result!.stdout);
}