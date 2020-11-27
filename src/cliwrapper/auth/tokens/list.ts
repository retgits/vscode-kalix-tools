'use strict';

import * as wrapper from '../../wrapper';
import * as tokenlist from '../../../datatypes/auth/tokenlist';

export async function run(): Promise<tokenlist.TokenList[]> {
    let command = new wrapper.Command(`auth tokens list -o json`);
    let result = await command.runCommand();
    return tokenlist.Convert.toTokenList(result!.stdout);
}