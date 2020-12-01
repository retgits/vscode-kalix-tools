'use strict';

import { Command } from '../wrapper';
import { Convert } from '../../datatypes/converter';
import { Project } from '../../datatypes/projects/project';

export async function ListProjects(): Promise<Project[]> {
    let command = new Command('projects list -o json');
    let result = await command.runCommand();
    return Convert.toProjectArray(result!.stdout);
}