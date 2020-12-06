import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { ShellResult } from '../../../utils/shell/datatypes';

export async function login(shell: Shell): Promise<ShellResult> {
    let command = new Command('akkasls auth login', shell);
    return command.run();
}