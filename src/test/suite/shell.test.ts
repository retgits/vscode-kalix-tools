/*global suite, test, process*/
import { expect } from 'chai';
import { shell } from '../../components/shell/shell';
import { ChildProcess } from 'child_process';
import * as vscode from 'vscode';

suite('Test Shell', () => {
	vscode.window.showInformationMessage('Run shell tests.');

	test('Should validate operating systems', () => {
		let currOS = process.platform;
		if(currOS === 'win32') {
			expect(shell.isWindows()).equals(true);
			expect(shell.isUnix()).equals(false);
			expect(shell.isSupported()).equals(true);
		} else {
			expect(shell.isWindows()).equals(false);
			expect(shell.isUnix()).equals(true);
			expect(shell.isSupported()).equals(true);
		}
	});

	test('Should validate PATH', () => {
		expect(shell.which('curl')).to.not.be.null;
		expect(shell.which('bla')).to.be.null;
	});

	test('Should execute commands', async () => {
		let result = await shell.exec('echo bla');
		expect(result.code).to.equal(0);
		expect(result.stdout).to.contain('bla');
		expect(result.stderr).to.equal('');
	});

	test('Should execute commands with extra options', async () => {
		let result = await shell.exec('echo bla', {
			async: false,
			silent: true,
		});
		expect(result.code).to.equal(0);
		expect(result.stdout).to.contain('bla');
		expect(result.stderr).to.equal('');
	});

	test('Should execute commands with callbacks', async () => {
		await shell.execStreaming('echo bla', function (proc: ChildProcess): void {
			expect(proc.stdout).to.contain('bla');
		});
	});
});
