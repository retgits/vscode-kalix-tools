import { Command } from '../../../../utils/shell/command';
import { Shell } from '../../../../utils/shell/shell';
import { Token } from '../../../datatypes/auth/tokens';
import { Convert } from '../../../datatypes/converter';

export async function listAuthTokens(shell: Shell): Promise<Token[]> {
    let command = new Command('akkasls auth tokens list -o json', shell);
    let result = await command.run();
    return Convert.toTokenList(result!.stdout);
}