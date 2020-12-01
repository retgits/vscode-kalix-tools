'use strict';

import { Command } from '../wrapper';
import { Convert } from '../../datatypes/converter';
import { Member } from '../../datatypes/roles/member';

export async function ListMembers(projectID: string): Promise<Member[]> {
    let command = new Command(`roles list-bindings --project ${projectID} -o json`);
    let result = await command.runCommand();
    return Convert.toMemberArray(result!.stdout);
}