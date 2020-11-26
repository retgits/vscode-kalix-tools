'use strict';

import * as wrapper from '../wrapper';
import * as member from '../../datatypes/roles/member';

export async function run(projectID: string): Promise<member.Member[]> {
    let command = new wrapper.Command(`roles list-bindings --project ${projectID} -o json`);
    let result = await command.runCommand();
    return member.Convert.toMemberArray(result!.stdout);
}