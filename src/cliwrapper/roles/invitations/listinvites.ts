'use strict';

import { Command } from '../../wrapper';
import { Convert } from '../../../datatypes/converter';
import { Invite } from '../../../datatypes/roles/invitations/invite';

export async function ListInvites(projectID: string): Promise<Invite[]> {
    let command = new Command(`roles invitations list --project ${projectID} -o json`);
    let result = await command.runCommand();
    return Convert.toInviteArray(result!.stdout);
}