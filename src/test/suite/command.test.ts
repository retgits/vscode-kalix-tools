/*global suite, test*/
import { expect } from 'chai';
import { Command } from '../../components/akkasls/command';
import { ChildProcess } from 'child_process';
import * as vscode from 'vscode';

suite('Test Command', () => {
    vscode.window.showInformationMessage('Run command tests.');

	test('Should create command', () => {
		let cmd = new Command('ls');
        expect(cmd.toString()).to.equal('ls');
	});

    test('Should add parameters', () => {
		let cmd = new Command('ls');
        cmd.addParameter({
            name: 'bla',
            value: 'test',
            addNameToCommand: true
        });
        expect(cmd.toString()).to.equal('ls --bla test');
	});

    test('Should set global config flags', () => {
		let cmd = new Command('ls');
        cmd.setSilent(true);
        cmd.setConfigFile('.bla.txt');
        cmd.setContext('bla');
        expect(cmd.getShellOpts().silent).to.equal(true);
        expect(cmd.toString()).to.equal('ls --config .bla.txt --context bla');
	});

    test('Should return command with dryrun', async () => {
		let cmd = new Command('ls');
        let result = await cmd.dryRun();
        expect(result.stdout).to.equal('ls');
	});

    test('Should run the command', async () => {
		let cmd = new Command('echo bla');
        let result = await cmd.run();
        expect(result.stdout).to.contain('bla');
	});

    test('Should execute commands with callbacks', async () => {
        let cmd = new Command('echo bla');
		await cmd.stream(function (proc: ChildProcess): void {
			expect(proc.stdout).to.contain('bla');
		});
	});
});