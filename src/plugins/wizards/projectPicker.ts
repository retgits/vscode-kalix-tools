import { Project } from '@retgits/akkasls-nodewrapper';
import { QuickPickItem, window } from 'vscode';

export async function projectPicker(title: string, projects: Project[]): Promise<string> {
    const projectPickItems: QuickPickItem[] = projects.map(project => ({label: project.friendly_name}));
    const projectPick = await window.showQuickPick(projectPickItems, {
        canPickMany: false,
        ignoreFocusOut: true,
        placeHolder: title
    });

    if (projectPick?.label) {
        return getProjectIDByName(projectPick.label, projects);
    }

    throw new Error('No project selected');
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