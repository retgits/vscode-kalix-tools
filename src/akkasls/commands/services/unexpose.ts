import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { ShellResult } from '../../../utils/shell/datatypes';

export async function unexposeService(service: string, hostname: string, projectID: string, shell: Shell): Promise<ShellResult> {
    let command = new Command('akkasls services unexpose', shell);
    command.addParameter({name: 'service', value: service, addNameToCommand: false});
    command.addParameter({name: 'hostname', value: hostname, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});
    return await command.run();
}