'use strict';

import * as wrapper from '../wrapper';
import * as credentials from '../../datatypes/docker/listcredentials';

export async function run(projectID: string): Promise<credentials.ListCredentials[]> {
    let command = new wrapper.Command(`docker list-credentials --project ${projectID} -o json`);
    let result = await command.runCommand();
    return credentials.Convert.toListCredentials(result!.stdout);
}