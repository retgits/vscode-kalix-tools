import { Command } from '../../../../utils/shell/command';
import { Shell } from '../../../../utils/shell/shell';
import { ShellResult } from '../../../../utils/shell/datatypes';

export async function revokeAuthToken(tokenID: string, shell: Shell): Promise<ShellResult> {
    let command = new Command('akkasls auth tokens revoke', shell);
    command.addParameter({name: 'token', value: tokenID, addNameToCommand: false});
    return await command.run();
}