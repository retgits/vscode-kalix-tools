// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Standard node imports
import { ChildProcess } from 'child_process';

// Internal dependencies
import { ServiceNode, ProjectNode } from './projectexplorer';
import { LogTypes, getCurrentCommandConfig } from '../cli/commands';
import { getServiceLogs, deployService, exposeService, unexposeService, deleteService } from '../cli/service';
import { logger } from '../../logger';
import { ShellResult } from '../../shell';

// Counter
let counter: number = 1;

/**
 * The showServiceLogs returns the logs of the service. It first shows a QuickPick to select logging options and executes `akkasls service logs` after.
 *
 * @export
 * @param {ServiceNode} svc The service to get logs for
 * @return {*}
 */
export async function showServiceLogs(svc: ServiceNode) {
    const result = await vscode.window.showQuickPick(['Show cloudstate sidecar logs', 'Show lifecycle logs', 'Show HTTP proxy logs', 'Show service logs', 'Stream logs for a live tail'], {
		canPickMany: true,
        ignoreFocusOut: true,
        placeHolder: 'Select service log options'
	});

    if (result === undefined) {
        return;
    }

    const lt: LogTypes = {};

    if (result.includes('Show cloudstate sidecar logs')) {
        lt.cloudstateLogs = true;
    }

    if (result.includes('Show lifecycle logs')) {
        lt.lifecycleLogs = true;
    }

    if (result.includes('Show HTTP proxy logs')) {
        lt.proxyLogs = true;
    }

    if (result.includes('Show service logs')) {
        lt.serviceLogs = true;
    }

    if (result.includes('Stream logs for a live tail')) {
        lt.follow = true;
        lt.callback = servicelogsFollowHandler;
    }

    const resultLines = await vscode.window.showInputBox({
        prompt: 'The maximum number of lines to fetch (defaults to 100)',
        ignoreFocusOut: true,
        password: false,
        value: '100',
        validateInput: validateNumber
    });

    if (resultLines === undefined) {
        lt.tail = 100;
    } else {
        lt.tail = Number.parseInt(resultLines);
    }

    const logs = await getServiceLogs(svc.service.metadata.name, svc.parentProjectID, lt, getCurrentCommandConfig());

    if (!result.includes('Stream logs for a live tail') && logs !== undefined) {
        logger.log(logs.stdout);
    }
}

function validateNumber(s: string): undefined | string {
    if (/^\+?(0|[1-9]\d*)$/.test(s)) {
        return undefined;
    }
    return 'The input is not a valid number';
}

function servicelogsFollowHandler(cp: ChildProcess) {
    const writeEmitter = new vscode.EventEmitter<string>();
    let line = '';

    const pty: vscode.Pseudoterminal = {
        onDidWrite: writeEmitter.event,
        open: () => writeEmitter.fire('Logs'),
        close: () => { /* noop*/ },
        handleInput: (data: string) => {
            if (data === '\r') { // Enter
                writeEmitter.fire(`\r\n${line}\r\n`);
                line = '';
                return;
            }
            line += data;
            writeEmitter.fire(data);
        }
    };

    const terminal = vscode.window.createTerminal({ name: `Service logs :: ${counter}`, pty });
    counter++;
    terminal.show();

	if (cp.stdout === null ) {
		return;
	}

	cp.stdout.on('data', function (data) {
		console.log(data);
		const lines = data.split(/\r?\n/);
		lines.forEach((element: any) => {
			writeEmitter.fire(`${element}\r\n`);
		});
	});
}

export async function createService(p: ProjectNode): Promise<ShellResult | undefined> {
    const name = await vscode.window.showInputBox({
        prompt: 'The name of the service',
        ignoreFocusOut: true,
        password: false,
    });

    if (name === undefined) {
        return undefined;
    }

    const image = await vscode.window.showInputBox({
        prompt: 'The container image URL',
        ignoreFocusOut: true,
        password: false,
    });

    if (image === undefined) {
        return undefined;
    }

    const vars = await vscode.window.showInputBox({
        prompt: 'The environment variables separated by commas, for example MY_VAR1=value1,MY_VAR2="value2 with spaces"',
        ignoreFocusOut: true,
        password: false,
    });

    if (vars === undefined) {
        return undefined;
    }

    try {
        const result = await deployService(name, image, p.parentProjectID, {vars: vars.split(',')}, getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}

export async function serviceDelete(s: ServiceNode): Promise<ShellResult | undefined> {
    try {
        const result = await deleteService(s.id, s.parentProjectID, getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}

export async function serviceExpose(s: ServiceNode): Promise<ShellResult | undefined> {
    const flags = await vscode.window.showInputBox({
        prompt: 'Any additional flags for the expose service, like --enable-cors',
        ignoreFocusOut: true,
        password: false,
    });

    if (flags === undefined) {
        return undefined;
    }

    try {
        const result = await exposeService(s.id, flags, s.parentProjectID, getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}

export async function serviceUnexpose(s: ServiceNode): Promise<ShellResult | undefined> {
    const host = await vscode.window.showInputBox({
        prompt: 'The hostname to remove from the service',
        ignoreFocusOut: true,
        password: false,
    });

    if (host === undefined) {
        return undefined;
    }

    try {
        const result = await unexposeService(s.id, host, s.parentProjectID, getCurrentCommandConfig());
        logger.log(result!.stdout);
        logger.log(result!.stderr);
        return result;
    } catch (ex) {
        vscode.window.showErrorMessage(ex);
        return undefined;
    }
}