import { getConfiguration } from '../../utils/config';
import { logger } from '../../utils/logger';
import { deleteProject } from '../akkasls/projects/deleteProject';
import { newProject } from '../akkasls/projects/newProject';
import { ShellResult } from '../shell/shell';
import { showInputBox } from '../wizard/inputBox';
import { ProjectExplorer } from './projectexplorer';
import { ProjectNode } from './projectnode';

export async function handleNewProject(tree: ProjectExplorer) {
    const res = await createProject();
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

export async function handleDeleteProject(p: ProjectNode, tree: ProjectExplorer) {
    const res = await removeProject(p);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

async function createProject(): Promise<ShellResult> {
    const name = await showInputBox({
        title: 'Create a new project (Step 1/2)',
        placeHolder: 'Set a name for your project...'
    });

    if (name === undefined) {
        return { code: -1, stderr: 'no name provided' };
    }

    const description = await showInputBox({
        title: 'Create a new project (Step 2/2)',
        placeHolder: 'Add a description for your project...'
    });

    if (description === undefined) {
        return { code: -1, stderr: 'no description provided' };
    }

    let result: ShellResult;
    
    try {
        result = await newProject(name, description, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}

async function removeProject(p: ProjectNode): Promise<ShellResult> {
    let result: ShellResult;
    
    try {
        result = await deleteProject(p.id, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}