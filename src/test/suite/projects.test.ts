/*global suite, test*/
import { expect } from 'chai';
import { deleteProject } from '../../components/akkasls/projects/deleteProject';
import { getProject } from '../../components/akkasls/projects/getProject';
import { listProjects } from '../../components/akkasls/projects/listProjects';
import { newProject } from '../../components/akkasls/projects/newProject';
import * as vscode from 'vscode';

suite('Test projects module', () => {
	vscode.window.showInformationMessage('Run project tests.');

	test('Should delete a project', async () => {
		let result = await deleteProject('pid', {dryrun: true});
        expect(result.stdout).to.equal('akkasls projects delete --project pid');
	});

    test('Should get project details', async () => {
		let result = await getProject('pid', {dryrun: true});
        expect(result.stdout).to.equal('akkasls projects get -o json --project pid');
	});

    test('Should list all projects', async () => {
		let result = await listProjects({dryrun: true});
        expect(result.stdout).to.equal('akkasls projects list -o json');
	});

    test('Should create a new project', async () => {
		let result = await newProject('project', 'desc', {dryrun: true});
        expect(result.stdout).to.equal('akkasls projects new project "desc" --region us-east1');
	});
});