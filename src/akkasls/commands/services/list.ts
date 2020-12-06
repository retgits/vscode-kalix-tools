import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { Service } from '../../datatypes/services/service';
import { Convert } from '../../datatypes/converter';

export async function listServices(projectID: string, shell: Shell): Promise<Service[]> {
    let command = new Command('akkasls services list -o json', shell);
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});
    let result = await command.run();
    return Convert.toServiceArray(result!.stdout);
}