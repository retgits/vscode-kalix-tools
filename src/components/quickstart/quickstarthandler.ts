import { getConfiguration } from '../../utils/config';
import { logger } from '../../utils/logger';
import { Convert } from '../akkasls/api';
import { downloadQuickstart } from '../akkasls/quickstart/downloadQuickstart';
import { listQuickstarts } from '../akkasls/quickstart/listQuickstarts';
import { ShellResult } from '../shell/shell';
import { showOpenDialog } from '../wizard/openDialog';
import { showSingleQuickPick } from '../wizard/quickPick';

export async function handleDownloadQuickstart() {
    const res = await dlQuickstart();
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
}

async function dlQuickstart(): Promise<ShellResult> {
    let res = await listQuickstarts(getConfiguration());

    if (res.code !== undefined) {
        return { code: -1, stderr: res.stderr };
    }

    let qs = [];

    let json = Convert.toQuickstart(res.stdout!);

    for (let index = 0; index < json.quickstarts.length; index++) {
        const element = json.quickstarts[index];
        qs.push(element.id);
    }

    const quickstart = await showSingleQuickPick({
        items: qs,
        title: 'Download Akka Serverless Quickstarts (Step 1/2)',
        placeHolder: 'Choose a quickstart...'
    });

    if (quickstart === undefined) {
        return { code: -1, stderr: 'no quickstart selected' };
    }

    const folder = await showOpenDialog({
        canSelectMany: false,
        canSelectFiles: false,
        canSelectFolders: true,
        title: 'Select folder to save project to'
    });

    if (folder === undefined) {
        return { code: -1, stderr: 'no folder selected' };
    }

    let result: ShellResult;

    try {
        result = await downloadQuickstart(quickstart, folder[0].fsPath, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}