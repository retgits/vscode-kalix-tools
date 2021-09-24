/*global suite, test*/
import { expect } from 'chai';
import { addInvite } from '../../components/akkasls/roles/addInvite';
import { deleteInvite } from '../../components/akkasls/roles/deleteInvite';
import { listInvites } from '../../components/akkasls/roles/listInvites';
import { listMembers } from '../../components/akkasls/roles/listMembers';
import * as vscode from 'vscode';

suite('Test roles module', () => {
	vscode.window.showInformationMessage('Run roles tests.');

	test('Should add an invite', async () => {
		let result = await addInvite('pid', 'example@example.example', {dryrun: true});
        expect(result.stdout).to.equal('akkasls roles invitations invite-user example@example.example --role admin --project pid');
	});

    test('Should delete invites', async () => {
		let result = await deleteInvite('pid', 'example@example.example', {dryrun: true});
        expect(result.stdout).to.equal('akkasls roles invitations delete example@example.example --project pid');
	});

    test('Should list all invites', async () => {
		let result = await listInvites('pid',{dryrun: true});
        expect(result.stdout).to.equal('akkasls roles invitations list -o json --project pid');
	});

    test('Should list all members', async () => {
		let result = await listMembers('pid', {dryrun: true});
        expect(result.stdout).to.equal('akkasls roles list-bindings -o json --project pid');
	});
});