import { ProjectExplorerNode } from './projectexplorernode';
import { ProjectExplorer } from './projectexplorer';
import { logger } from '../../utils/logger';
import { INVITE_ITEM_TYPE } from '../../utils/constants';
import { InviteNode } from './invitenode';
import { ShellResult } from '../shell/shell';
import { getConfiguration } from '../../utils/config';
import { showInputBox } from '../wizard/inputBox';
import { addInvite } from '../akkasls/roles/addInvite';
import { deleteInvite } from '../akkasls/roles/deleteInvite';

export async function handleSendInvitation(p: ProjectExplorerNode, tree: ProjectExplorer) {
    const res = await sendInvitation(p);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

export async function handleDeleteInvitation(i: InviteNode, tree: ProjectExplorer) {
    if (i.label === INVITE_ITEM_TYPE) {
        return;
    }

    const res = await deleteInvitation(i);
    if (res.stderr) {
        logger.log(res.stderr);
    }
    if (res.stdout) {
        logger.log(res.stdout);
    }
    tree.refresh();
}

async function sendInvitation(p: ProjectExplorerNode): Promise<ShellResult> {
    const email = await showInputBox({
        title: 'Invite user to project',
        prompt: 'The email address of the user to invite',
        placeHolder: 'example@example.com'
    });

    if (email === undefined) {
        return { code: -1, stderr: 'no email address provided' };
    }

    let result: ShellResult;

    try {
        result = await addInvite(p.parentProjectID, email, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}

async function deleteInvitation(i: InviteNode): Promise<ShellResult> {
    let result: ShellResult;

    try {
        result = await deleteInvite(i.parentProjectID, i.invite.email, getConfiguration());
    }
    catch (ex: any) {
        result = {
            code: -1,
            stderr: ex
        };
    }

    return result;
}