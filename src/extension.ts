'use strict';

import * as vscode from 'vscode';

// Internal dependencies
import { aslogger } from './utils/logger';

import { AkkaServerless } from './akkasls';
import { ProjectExplorer } from './views/projectexplorer/explorer';
import { StatusExplorer } from './views/statusexplorer/explorer';
import { ToolsExplorer } from './views/toolsexplorer/explorer';
import { CredentialsExplorer } from './views/credentialsexplorer/explorer';

import { CredentialsBaseTreeItem } from './views/credentialsexplorer/credentialsBaseTreeItem';
import { ProjectBaseTreeItem } from './views/projectexplorer/projectBaseTreeItem';
import { ToolTreeItem } from './views/toolsexplorer/toolsTreeItem';
import { ServiceTreeItem } from './views/projectexplorer/serviceTreeItem';
import { InviteTreeItem } from './views/projectexplorer/inviteTreeItem';
import { DockerTreeItem } from './views/projectexplorer/dockerTreeItem';
import { TokenTreeItem } from './views/credentialsexplorer/tokenTreeItem';

import { templateWizard } from './templatewizard/wizard';

export function activate(context: vscode.ExtensionContext) {
	const akkasls = new AkkaServerless();

	// Projects Tree
	const projectExplorer = new ProjectExplorer(akkasls);
	vscode.window.registerTreeDataProvider('as.views.projects', projectExplorer);
	vscode.commands.registerCommand('as.views.projects.refresh', () => projectExplorer.refresh());
	vscode.commands.registerCommand('as.views.projects.credentials.add', async (item: ProjectBaseTreeItem) => projectExplorer.addDockerCredentials(item));
	vscode.commands.registerCommand('as.views.projects.credentials.delete', async (item: DockerTreeItem) => projectExplorer.deleteDockerCredentials(item));
	vscode.commands.registerCommand('as.views.projects.services.deploy', async (item: ProjectBaseTreeItem) => projectExplorer.deployService(item));
	vscode.commands.registerCommand('as.views.projects.services.undeploy', async (item: ServiceTreeItem) => projectExplorer.undeployService(item));
	vscode.commands.registerCommand('as.views.projects.services.expose', async (item: ServiceTreeItem) => projectExplorer.exposeService(item));
	vscode.commands.registerCommand('as.views.projects.services.unexpose', async (item: ServiceTreeItem) => projectExplorer.unexposeService(item));
	vscode.commands.registerCommand('as.views.projects.invites.inviteuser', async (item: ProjectBaseTreeItem) => projectExplorer.inviteUser(item));
	vscode.commands.registerCommand('as.views.projects.invites.deleteinvite', async (item: InviteTreeItem) => projectExplorer.deleteInvite(item));
	vscode.commands.registerCommand('as.views.projects.new', async () => projectExplorer.newProject());
	vscode.commands.registerCommand('as.views.projects.openbrowser', async (item: ProjectBaseTreeItem) => projectExplorer.openTreeItemInBrowser(item));
	vscode.commands.registerCommand('as.views.projects.details.projects', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.services', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.members', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.invites', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.credentials', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));

	// Tools tree
	const toolsExplorer = new ToolsExplorer();
	vscode.window.registerTreeDataProvider('as.views.tools', toolsExplorer);
	vscode.commands.registerCommand('as.views.tools.refresh', () => toolsExplorer.refresh());
	vscode.commands.registerCommand('as.views.tools.info', async (item: ToolTreeItem) => toolsExplorer.openTreeItemInBrowser(item));

	// Status tree	
	const statusExplorer = new StatusExplorer();
	vscode.window.registerTreeDataProvider('as.views.status', statusExplorer);
	vscode.commands.registerCommand('as.views.status.refresh', () => statusExplorer.refresh());
	vscode.commands.registerCommand('as.views.status.info', () => statusExplorer.openTreeItemInBrowser());
	context.subscriptions.push(vscode.commands.registerCommand('as.views.status.view', async () => { statusExplorer.openTreeItemInBrowser(); }));

	// Credentials Tree
	const credentialsExplorer = new CredentialsExplorer(akkasls);
	vscode.window.registerTreeDataProvider('as.views.credentials', credentialsExplorer);
	vscode.commands.registerCommand('as.views.credentials.refresh', () => credentialsExplorer.refresh());
	vscode.commands.registerCommand('as.views.credentials.revoke', (item: TokenTreeItem) => credentialsExplorer.revokeCredential(item));
	vscode.commands.registerCommand('as.views.credentials.details.tokens', async (item: CredentialsBaseTreeItem) => { credentialsExplorer.printTreeItemDetails(item); });

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
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.tokens.revoke', async () => { akkasls.revokeToken(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.templatewizard', async () => { templateWizard(); }));
}

export function deactivate() {
	aslogger.dispose();
}