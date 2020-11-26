'use strict';

import * as wrapper from '../../wrapper';
import * as invite from '../../../datatypes/roles/invitations/invite';

export async function run(projectID: string): Promise<invite.Invite[]> {
    let command = new wrapper.Command(`roles invitations list --project ${projectID} -o json`);
    let result = await command.runCommand();
    return invite.Convert.toInviteArray(result!.stdout);
}