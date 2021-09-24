import { ShellResult } from '../shell/shell';
import { ContainerRegistryCredentialNode } from './containerregistrycredentialnode';
import { ProjectExplorer } from './projectexplorer';
import { logger } from '../../utils/logger';
import { showInputBox } from '../wizard/inputBox';
import { addCredentials } from '../akkasls/docker/addCredentials';
import { getConfiguration } from '../../utils/config';
import { deleteCredentials } from '../akkasls/docker/deleteCredentials';
import { ProjectExplorerNode } from './projectexplorernode';
import { REGISTRY_CREDENTIALS_ITEM_TYPE } from '../../utils/constants';

export async function handleAddRegistryCredentials(p: ProjectExplorerNode, tree: ProjectExplorer) {
    const res = await addRegistryCredentials(p);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

export async function handleDeleteRegistryCredentials(p: ContainerRegistryCredentialNode, tree: ProjectExplorer) {
    if (p.label === REGISTRY_CREDENTIALS_ITEM_TYPE) {
        return;
    }
    
    const res = await deleteRegistryCredentials(p);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

async function addRegistryCredentials(p: ProjectExplorerNode): Promise<ShellResult> {
    const creds = await showInputBox({
        title: 'Add container registry credentials',
        prompt: 'The credential string for the container registry',
        placeHolder: '--docker-email <> --docker-password <> --docker-server <> --docker-username <>'
    });

    if (creds === undefined) {
        return { code: -1, stderr: 'no credentials provided' };
    }

    let result: ShellResult;

    try {
        result = await addCredentials(p.parentProjectID, creds, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}

async function deleteRegistryCredentials(c: ContainerRegistryCredentialNode): Promise<ShellResult> {
    let result: ShellResult;

    try {
        result = await deleteCredentials(c.parentProjectID, c.id, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}