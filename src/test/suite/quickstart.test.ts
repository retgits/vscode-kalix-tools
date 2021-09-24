/*global suite, test*/
import { expect } from 'chai';
import { downloadQuickstart } from '../../components/akkasls/quickstart/downloadQuickstart';
import { listQuickstarts } from '../../components/akkasls/quickstart/listQuickstarts';
import * as vscode from 'vscode';

suite('Test quickstart module', () => {
	vscode.window.showInformationMessage('Run quickstart tests.');

	test('Should list quickstarts', async () => {
		let result = await listQuickstarts({dryrun: true});
        expect(result.stdout).to.equal('akkasls quickstart list -o json');
	});

    test('Should download a quickstart', async () => {
		let result = await downloadQuickstart('id', 'dir', {dryrun: true});
        expect(result.stdout).to.equal('akkasls quickstart download id --output-dir "dir"');
	});

});