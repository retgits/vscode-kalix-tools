import { Command } from '../../../utils/shell/command';
import { Shell } from '../../../utils/shell/shell';
import { Project } from '../../datatypes/projects/project';
import { Convert } from '../../datatypes/converter';

export async function listProjects(shell: Shell): Promise<Project[]> {
    let command = new Command('akkasls projects list -o json', shell);
    let result = await command.run();
    return Convert.toProjectArray(result!.stdout);
}