/*global suite, test*/
import { expect } from 'chai';
import { deleteService } from '../../components/akkasls/services/deleteService';
import { deployService } from '../../components/akkasls/services/deployService';
import { exposeService } from '../../components/akkasls/services/exposeService';
import { getServiceLogs } from '../../components/akkasls/services/getLogs';
import { getService } from '../../components/akkasls/services/getService';
import { listServices } from '../../components/akkasls/services/listServices';
import { redeployService } from '../../components/akkasls/services/redeployService';
import { unexposeService } from '../../components/akkasls/services/unexposeService';
import * as vscode from 'vscode';

suite('Test services module', () => {
	vscode.window.showInformationMessage('Run services tests.');

	test('Should delete a service', async () => {
		let result = await deleteService('svc', 'pid', {dryrun: true});
        expect(result.stdout).to.equal('akkasls services undeploy svc --project pid');
	});

    test('Should deploy a service', async () => {
		let result = await deployService('svc', 'img', 'pid', {}, {dryrun: true});
        expect(result.stdout).to.equal('akkasls services deploy svc img --project pid');
	});

    test('Should deploy a service with env vars', async () => {
		let result = await deployService('svc', 'img', 'pid', {msg: 'hello'}, {dryrun: true});
        expect(result.stdout).to.equal('akkasls services deploy svc img --project pid --env msg=hello');
	});

    test('Should expose a service', async () => {
		let result = await exposeService('svc', 'flags', 'pid', {dryrun: true});
        expect(result.stdout).to.equal('akkasls services expose svc --project pid flags');
	});

    test('Should get service logs', async () => {
		let result = await getServiceLogs('svc', 'pid', {instanceLogs: true}, {dryrun: true});
        expect(result.stdout).to.equal('akkasls services logs svc --project pid --instance');
	});

    test('Should get service details', async () => {
		let result = await getService('svc', 'pid', {dryrun: true});
        expect(result.stdout).to.equal('akkasls services get -o json svc --project pid');
	});

    test('Should list all services', async () => {
		let result = await listServices('pid', {dryrun: true});
        expect(result.stdout).to.equal('akkasls services list -o json --project pid');
	});

    test('Should redeploy a service', async () => {
		let result = await redeployService('svc', 'pid', {dryrun: true});
        expect(result.stdout).to.equal('akkasls services redeploy svc --project pid');
	});

    test('Should unexpose a service', async () => {
		let result = await unexposeService('svc', 'hostname', 'pid', {dryrun: true});
        expect(result.stdout).to.equal('akkasls services unexpose svc hostname --project pid');
	});
});