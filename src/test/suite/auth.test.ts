/*global suite, test*/
import { expect } from 'chai';
import { createToken } from '../../components/akkasls/auth/createToken';
import { currentLogin } from '../../components/akkasls/auth/currentLogin';
import { listTokens } from '../../components/akkasls/auth/listTokens';
import { login } from '../../components/akkasls/auth/login';
import { logout } from '../../components/akkasls/auth/logout';
import { revokeToken } from '../../components/akkasls/auth/revokeToken';
import * as vscode from 'vscode';

suite('Test auth module', () => {
	vscode.window.showInformationMessage('Run auth tests.');

	test('Should create token', async () => {
		let result = await createToken('refresh', 'all', 'test', {dryrun: true});
        expect(result.stdout).to.equal('akkasls auth tokens create --type refresh --scopes all --description "test"');
	});

    test('Should get current login', async () => {
		let result = await currentLogin({dryrun: true});
        expect(result.stdout).to.equal('akkasls auth current-login -o json');
	});

    test('Should list tokens', async () => {
		let result = await listTokens({dryrun: true});
        expect(result.stdout).to.equal('akkasls auth tokens list -o json');
	});

    test('Should start login', async () => {
		let result = await login({dryrun: true});
        expect(result.stdout).to.equal('akkasls auth login');
	});

    test('Should start logout', async () => {
		let result = await logout({dryrun: true});
        expect(result.stdout).to.equal('akkasls auth logout');
	});

    test('Should revoke token', async () => {
		let result = await revokeToken('1234',{dryrun: true});
        expect(result.stdout).to.equal('akkasls auth tokens revoke 1234');
	});
});