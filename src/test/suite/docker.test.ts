/*global suite, test*/
import { expect } from 'chai';
import { addCredentials } from '../../components/akkasls/docker/addCredentials';
import { deleteCredentials } from '../../components/akkasls/docker/deleteCredentials';
import { listCredentials } from '../../components/akkasls/docker/listCredentials';
import * as vscode from 'vscode';

suite('Test docker module', () => {
	vscode.window.showInformationMessage('Run docker tests.');

	test('Should add credentials', async () => {
		let result = await addCredentials('pid', 'str', {dryrun: true});
        expect(result.stdout).to.equal('akkasls docker add-credentials str --project pid');
	});

    test('Should delete credentials', async () => {
		let result = await deleteCredentials('pid', 'credID', {dryrun: true});
        expect(result.stdout).to.equal('akkasls docker delete-credentials credID --project pid');
	});

    test('Should list credentials', async () => {
		let result = await listCredentials('pid', {dryrun: true});
        expect(result.stdout).to.equal('akkasls docker list-credentials -o json --project pid');
	});
});