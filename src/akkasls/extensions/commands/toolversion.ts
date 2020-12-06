import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { ShellResult } from '../../../utils/shell/datatypes';

export async function toolVersion(tool: string, versionCmd: string, shell: Shell): Promise<ShellResult> {
    let command = new Command(`${tool} ${versionCmd}`, shell);
    return command.run();
}