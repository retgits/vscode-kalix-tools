/*global console*/
import { ServiceNode } from './servicenode';
import { showMultiQuickPick } from '../wizard/quickPick';
import { LogTypes } from '../akkasls/command';
import { showInputBox } from '../wizard/inputBox';
import { getServiceLogs } from '../akkasls/services/getLogs';
import { getConfiguration } from '../../utils/config';
import { logger } from '../../utils/logger';
import * as vscode from 'vscode';
import { ChildProcess } from 'child_process';

// Counter
let counter: number = 1;

export async function showServiceLogs(svc: ServiceNode) {
    const result = await showMultiQuickPick({
        items: ['Show instance logs', 'Show lifecycle logs', 'Stream logs'],
        title: 'Select service log options (Step 1/2)'
    });

    if (result === undefined) {
        
        return;
    }

    const lt: LogTypes = {};

    if (result.includes('Show instance logs')) {
        lt.instanceLogs = true;
    }

    if (result.includes('Show lifecycle logs')) {
        lt.lifecycleLogs = true;
    }

    if (result.includes('Stream logs')) {
        lt.followLogs = true;
        lt.callback = servicelogsFollowHandler;
    }

    const lines = await showInputBox({
        title: 'Select service log options (Step 2/2)',
        prompt: 'The maximum number of lines to fetch (defaults to 100)',
        placeHolder: '100',
        validator: validateNumber
    });

    if (lines === undefined) {
        lt.tailLines = 100;
    } else {
        lt.tailLines = Number.parseInt(lines);
    }

    const logs = await getServiceLogs(svc.service.metadata.name, svc.parentProjectID, lt, getConfiguration());

    if (!result.includes('Stream logs for a live tail') && logs !== undefined) {
        logger.log(logs.stdout!);
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