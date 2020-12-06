import { Project } from '../../akkasls/datatypes/projects/project';
import { QuickPickItem, window } from 'vscode';

export async function projectPicker(title: string, projects: Project[]): Promise<string> {
    let projectPickItems: QuickPickItem[] = projects.map(project => ({label: project.friendly_name}));
    let projectPick = await window.showQuickPick(projectPickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: title
    });

    return getProjectIDByName(projectPick!.label, projects);
}

function getProjectIDByName(name: string, projects: Project[]): string {
    let projectID = '';
    projects.forEach((project) => {
        if (project.friendly_name === name) {
            projectID = project.name.substring(9);
        }
    });
    return projectID;
}