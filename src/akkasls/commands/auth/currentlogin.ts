import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { CurrentLogin } from '../../datatypes/auth/currentlogin';
import { Convert } from '../../datatypes/converter';

export async function currentLogin(shell: Shell): Promise<CurrentLogin> {
    let command = new Command('akkasls auth current-login', shell);
    let result = await command.run();
    return Convert.toCurrentLogin(result!.stdout);
}