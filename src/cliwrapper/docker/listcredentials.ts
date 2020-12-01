'use strict';

import { Command } from '../wrapper';
import { Convert } from '../../datatypes/converter';
import { ListCredentials } from '../../datatypes/docker/listcredentials';

export async function ListDockerCredentials(projectID: string): Promise<ListCredentials[]> {
    let command = new Command(`docker list-credentials --project ${projectID} -o json`);
    let result = await command.runCommand();
    return Convert.toListCredentials(result!.stdout);
}