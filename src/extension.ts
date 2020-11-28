'use strict';

import * as vscode from 'vscode';

// Internal dependencies
import { aslogger } from './utils/logger';

import * as projects from './views/projectexplorer/explorer';
import * as status from './views/statusexplorer/explorer';
import * as tools from './views/toolsexplorer/explorer';
import * as credentials from './views/credentialsexplorer/explorer';

import * as credentialBase from './views/credentialsexplorer/credentialsBaseTreeItem';
import * as projectBase from './views/projectexplorer/projectBaseTreeItem';
import * as toolitem from './views/toolsexplorer/toolsTreeItem';
import * as service from './views/projectexplorer/serviceTreeItem';
import * as invite from './views/projectexplorer/inviteTreeItem';
import * as docker from './views/projectexplorer/dockerTreeItem';
import * as token from './views/credentialsexplorer/tokenTreeItem';

import * as AkkaServerless from './akkasls';

export function activate(context: vscode.ExtensionContext) {
	const akkasls = new AkkaServerless.AkkaServerless();

	// Projects Tree
	const projectExplorer = new projects.ProjectExplorer(akkasls);
	vscode.window.registerTreeDataProvider('as.views.projects', projectExplorer);
	vscode.commands.registerCommand('as.views.projects.refresh', () => projectExplorer.refresh());
	vscode.commands.registerCommand('as.views.projects.credentials.add', async (item: projectBase.TreeItem) => projectExplorer.addDockerCredentials(item));
	vscode.commands.registerCommand('as.views.projects.credentials.delete', async (item: docker.DockerTreeItem) => projectExplorer.deleteDockerCredentials(item));
	vscode.commands.registerCommand('as.views.projects.services.deploy', async (item: projectBase.TreeItem) => projectExplorer.deployService(item));
	vscode.commands.registerCommand('as.views.projects.services.undeploy', async (item: service.ServiceTreeItem) => projectExplorer.undeployService(item));
	vscode.commands.registerCommand('as.views.projects.services.expose', async (item: service.ServiceTreeItem) => projectExplorer.exposeService(item));
	vscode.commands.registerCommand('as.views.projects.services.unexpose', async (item: service.ServiceTreeItem) => projectExplorer.unexposeService(item));
	vscode.commands.registerCommand('as.views.projects.invites.inviteuser', async (item: projectBase.TreeItem) => projectExplorer.inviteUser(item));
	vscode.commands.registerCommand('as.views.projects.invites.deleteinvite', async (item: invite.InviteTreeItem) => projectExplorer.deleteInvite(item));
	vscode.commands.registerCommand('as.views.projects.new', async () => projectExplorer.newProject());
	vscode.commands.registerCommand('as.views.projects.openbrowser', async (item: projectBase.TreeItem) => projectExplorer.openTreeItemInBrowser(item));
	vscode.commands.registerCommand('as.views.projects.details.projects', async (item: projectBase.TreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.services', async (item: projectBase.TreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.members', async (item: projectBase.TreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.invites', async (item: projectBase.TreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.credentials', async (item: projectBase.TreeItem) => projectExplorer.printTreeItemDetails(item));

	// Tools tree
	const toolsExplorer = new tools.TreeDataProvider();
	vscode.window.registerTreeDataProvider('as.views.tools', toolsExplorer);
	vscode.commands.registerCommand('as.views.tools.refresh', () => toolsExplorer.refresh());
	vscode.commands.registerCommand('as.views.tools.info', async (item: toolitem.ToolTreeItem) => toolsExplorer.openTreeItemInBrowser(item));

	// Status tree	
	const statusExplorer = new status.StatusExplorer();
	vscode.window.registerTreeDataProvider('as.views.status', statusExplorer);
	vscode.commands.registerCommand('as.views.status.refresh', () => statusExplorer.refresh());
	vscode.commands.registerCommand('as.views.status.info', () => statusExplorer.openTreeItemInBrowser());
	context.subscriptions.push(vscode.commands.registerCommand('as.views.status.view', async () => { statusExplorer.openTreeItemInBrowser(); }));

	// Credentials Tree
	const credentialsExplorer = new credentials.CredentialsExplorer(akkasls);
	vscode.window.registerTreeDataProvider('as.views.credentials', credentialsExplorer);
	vscode.commands.registerCommand('as.views.credentials.refresh', () => credentialsExplorer.refresh());
	vscode.commands.registerCommand('as.views.credentials.revoke', (item: token.TokenTreeItem) => credentialsExplorer.revokeCredential(item));
	vscode.commands.registerCommand('as.views.credentials.details.tokens', async (item: credentialBase.TreeItem) => credentialsExplorer.printTreeItemDetails(item));

	// Menu Items
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.credentials.add', async () => { akkasls.addDockerCredentials(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.credentials.delete', async () => { akkasls.deleteDockerCredentials(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.auth.login', async () => { akkasls.login(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.auth.logout', async () => { akkasls.logout(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.deploy', async () => { akkasls.deployService(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.undeploy', async () => { akkasls.undeployService(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.expose', async () => { akkasls.exposeService(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.unexpose', async () => { akkasls.unexposeService(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.invites.inviteuser', async () => { akkasls.inviteUser(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.invites.deleteinvite', async () => { akkasls.deleteInvite(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.projects.local.start', async (uri: vscode.Uri) => { akkasls.startLocal(uri); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.projects.local.stop', async (uri: vscode.Uri) => { akkasls.stopLocal(uri); }));
}

export function deactivate() {
	aslogger.dispose();
}