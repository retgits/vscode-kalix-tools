'use strict';

import { Command } from '../wrapper';
import { Convert } from '../../datatypes/converter';
import { Service } from '../../datatypes/services/service';

export async function ListServices(projectID: string): Promise<Service[]> {
    let command = new Command(`svc list --project ${projectID} -o json`);
    let result = await command.runCommand();
    return Convert.toServiceArray(result!.stdout);
}