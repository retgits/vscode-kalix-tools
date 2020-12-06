import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { ShellResult } from '../../../utils/shell/datatypes';

export async function newProject(name: string, description: string, shell: Shell): Promise<ShellResult> {
    let command = new Command('akkasls projects new', shell);
    command.addParameter({name: 'name', value: name, addNameToCommand: false});
    command.addParameter({name: 'description', value: description, addNameToCommand: false});
    return await command.run();
}