import { getConfiguration } from '../../utils/config';
import { SECRET_ITEM_TYPE } from '../../utils/constants';
import { logger } from '../../utils/logger';
import { createSecret } from '../akkasls/secrets/createSecret';
import { deleteSecret } from '../akkasls/secrets/deleteSecret';
import { ShellResult } from '../shell/shell';
import { showInputBox } from '../wizard/inputBox';
import { ProjectExplorer } from './projectexplorer';
import { ProjectExplorerNode } from './projectexplorernode';
import { SecretNode } from './secretnode';

export async function handleCreateSecret(p: ProjectExplorerNode, tree: ProjectExplorer) {
    const res = await secretCreate(p);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

export async function handleDeleteSecret(p: SecretNode, tree: ProjectExplorer) {
    if (p.label === SECRET_ITEM_TYPE) {
        return;
    }

    const res = await secretDelete(p);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

async function secretCreate(p: ProjectExplorerNode): Promise<ShellResult> {
    const name = await showInputBox({
        title: 'Add a secret to your project (Step 1/2)',
        prompt: 'The name of the secret'
    });

    if (name === undefined) {
        return { code: '-1', stderr: 'no name provided' };
    }

    const vars = await showInputBox({
        title: 'Add a secret to your project (Step 2/2)',
        prompt: 'The secret variables separated by commas, for example MY_VAR1=value1,MY_VAR2="value2 with spaces"'
    });

    let envVars: any = {};

    if (vars !== undefined && vars.length > 1) {
        let v = vars.split(',');
        for (let index = 0; index < v.length; index++) {
            const element = v[index];
            let e = element.split('=');
            envVars[e[0]] = e[1];
        }
    }

    let result: ShellResult;

    try {
        result = await createSecret('generic', name, envVars, p.parentProjectID, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: '-1',
            stderr: ex
        };
    }

    return result;
}

async function secretDelete(s: SecretNode): Promise<ShellResult> {
    let result: ShellResult;

    try {
        result = await deleteSecret(s.label, s.parentProjectID, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: '-1',
            stderr: ex
        };
    }

    return result;
}
