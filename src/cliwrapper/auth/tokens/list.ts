'use strict';

import { Command } from '../../wrapper';
import { TokenList } from '../../../datatypes/auth/tokenlist';
import { Convert } from '../../../datatypes/converter';

export async function ListTokens(): Promise<TokenList[]> {
    let command = new Command(`auth tokens list -o json`);
    let result = await command.runCommand();
    return Convert.toTokenList(result!.stdout);
}