import { getConfiguration } from '../../utils/config';
import { SERVICE_ITEM_TYPE } from '../../utils/constants';
import { logger } from '../../utils/logger';
import { Convert } from '../akkasls/api';
import { getProject } from '../akkasls/projects/getProject';
import { deleteService } from '../akkasls/services/deleteService';
import { deployService } from '../akkasls/services/deployService';
import { exposeService } from '../akkasls/services/exposeService';
import { unexposeService } from '../akkasls/services/unexposeService';
import { ShellResult } from '../shell/shell';
import { showInputBox } from '../wizard/inputBox';
import { showSingleQuickPick } from '../wizard/quickPick';
import { ProjectExplorer } from './projectexplorer';
import { ProjectExplorerNode } from './projectexplorernode';
import { ServiceNode } from './servicenode';

export async function handleCreateService(p: ProjectExplorerNode, tree: ProjectExplorer) {
    const res = await createService(p);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

export async function handleDeleteService(p: ServiceNode, tree: ProjectExplorer) {
    if (p.label === SERVICE_ITEM_TYPE) {
        return;
    }

    const res = await serviceDelete(p);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

export async function handleServiceExpose(p: ServiceNode, tree: ProjectExplorer) {
    if (p.label === SERVICE_ITEM_TYPE) {
        return;
    }

    const res = await serviceExpose(p);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

export async function handleServiceUnexpose(p: ServiceNode, tree: ProjectExplorer) {
    if (p.label === SERVICE_ITEM_TYPE) {
        return;
    }

    const res = await serviceUnexpose(p);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

async function createService(p: ProjectExplorerNode): Promise<ShellResult> {
    const name = await showInputBox({
        title: 'Deploy service to Akka Serverless (Step 1/3)',
        prompt: 'The name of the service'
    });

    if (name === undefined) {
        return { code: -1, stderr: 'no name provided' };
    }

    const image = await showInputBox({
        title: 'Deploy service to Akka Serverless (Step 2/3)',
        prompt: 'The container image URL'
    });

    if (image === undefined) {
        return { code: -1, stderr: 'no image URL provided' };
    }

    const vars = await showInputBox({
        title: 'Deploy service to Akka Serverless (Step 3/3)',
        prompt: 'The environment variables separated by commas, for example MY_VAR1=value1,MY_VAR2="value2 with spaces"'
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
        result = await deployService(name, image, p.parentProjectID, envVars, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}

async function serviceDelete(s: ServiceNode): Promise<ShellResult> {
    let result: ShellResult;

    try {
        result = await deleteService(s.label, s.parentProjectID, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}

async function serviceExpose(s: ServiceNode): Promise<ShellResult> {
    const flags = await showInputBox({
        title: 'Add an HTTP endpoint to your service',
        prompt: 'Any additional flags for the expose service, like --enable-cors'
    });

    if (flags === undefined) {
        return { code: -1, stderr: 'no flags provided' };
    }

    let result: ShellResult;

    try {
        result = await exposeService(s.label, flags, s.parentProjectID, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}

async function serviceUnexpose(s: ServiceNode): Promise<ShellResult> {
    let p = await getProject(s.parentProjectID, getConfiguration());

    if (p.code !== undefined) {
        return { code: -1, stderr: p.stderr };
    }

    let project = Convert.toProjectDetails(p.stdout!);

    let hostnames = [];
    for (let index = 0; index < project.hostnames.length; index++) {
        const element = project.hostnames[index];
        hostnames.push(`${element.name}.${project.execution_cluster_name}.akkaserverless.app`);
    }

    const host = await showSingleQuickPick({
        items: hostnames,
        title: 'The hostname to remove from the service'
    });

    if (host === undefined) {
        return { code: -1, stderr: 'no hostname provided' };
    }

    let result: ShellResult;

    try {
        result = await unexposeService(s.label, host, s.parentProjectID, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}