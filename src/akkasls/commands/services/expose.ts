import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { ShellResult } from '../../../utils/shell/datatypes';

export async function exposeService(service: string, flags: string, projectID: string, shell: Shell): Promise<ShellResult> {
    let command = new Command('akkasls services expose', shell);
    command.addParameter({name: 'service', value: service, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});
    command.addParameter({name: 'flags', value: flags, addNameToCommand: false});
    return await command.run();
}