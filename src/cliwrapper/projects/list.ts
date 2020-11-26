'use strict';

import * as wrapper from '../wrapper';
import * as project from '../../datatypes/projects/project';

export async function run(): Promise<project.Project[]> {
    let command = new wrapper.Command('projects list -o json');
    let result = await command.runCommand();
    return project.Convert.toProjectArray(result!.stdout);
}