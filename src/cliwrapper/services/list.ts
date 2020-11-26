'use strict';

import * as wrapper from '../wrapper';
import * as services from '../../datatypes/services/service';

export async function run(projectID: string): Promise<services.Service[]> {
    let command = new wrapper.Command(`svc list --project ${projectID} -o json`);
    let result = await command.runCommand();
    return services.Convert.toServiceArray(result!.stdout);
}