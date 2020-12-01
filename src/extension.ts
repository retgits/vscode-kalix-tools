'use strict';

import { window, commands, ExtensionContext, Uri } from 'vscode';

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

import { TemplateWizard } from './wizards/templateWizard';

export function activate(context: ExtensionContext) {
	const akkasls = new AkkaServerless();

	// Projects Tree
	const projectExplorer = new ProjectExplorer(akkasls);
	window.registerTreeDataProvider('as.views.projects', projectExplorer);
	commands.registerCommand('as.views.projects.refresh', () => projectExplorer.refresh());
	commands.registerCommand('as.views.projects.credentials.add', async (item: ProjectBaseTreeItem) => projectExplorer.addDockerCredentials(item));
	commands.registerCommand('as.views.projects.credentials.delete', async (item: DockerTreeItem) => projectExplorer.deleteDockerCredentials(item));
	commands.registerCommand('as.views.projects.services.deploy', async (item: ProjectBaseTreeItem) => projectExplorer.deployService(item));
	commands.registerCommand('as.views.projects.services.undeploy', async (item: ServiceTreeItem) => projectExplorer.undeployService(item));
	commands.registerCommand('as.views.projects.services.expose', async (item: ServiceTreeItem) => projectExplorer.exposeService(item));
	commands.registerCommand('as.views.projects.services.unexpose', async (item: ServiceTreeItem) => projectExplorer.unexposeService(item));
	commands.registerCommand('as.views.projects.invites.inviteuser', async (item: ProjectBaseTreeItem) => projectExplorer.inviteUser(item));
	commands.registerCommand('as.views.projects.invites.deleteinvite', async (item: InviteTreeItem) => projectExplorer.deleteInvite(item));
	commands.registerCommand('as.views.projects.new', async () => projectExplorer.newProject());
	commands.registerCommand('as.views.projects.openbrowser', async (item: ProjectBaseTreeItem) => projectExplorer.openTreeItemInBrowser(item));
	commands.registerCommand('as.views.projects.details.projects', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.services', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.members', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.invites', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.credentials', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));

	// Tools tree
	const toolsExplorer = new ToolsExplorer();
	window.registerTreeDataProvider('as.views.tools', toolsExplorer);
	commands.registerCommand('as.views.tools.refresh', () => toolsExplorer.refresh());
	commands.registerCommand('as.views.tools.info', async (item: ToolTreeItem) => toolsExplorer.openTreeItemInBrowser(item));

	// Status tree	
	const statusExplorer = new StatusExplorer();
	window.registerTreeDataProvider('as.views.status', statusExplorer);
	commands.registerCommand('as.views.status.refresh', () => statusExplorer.refresh());
	commands.registerCommand('as.views.status.info', () => statusExplorer.openTreeItemInBrowser());
	context.subscriptions.push(commands.registerCommand('as.views.status.view', async () => { statusExplorer.openTreeItemInBrowser(); }));

	// Credentials Tree
	const credentialsExplorer = new CredentialsExplorer(akkasls);
	window.registerTreeDataProvider('as.views.credentials', credentialsExplorer);
	commands.registerCommand('as.views.credentials.refresh', () => credentialsExplorer.refresh());
	commands.registerCommand('as.views.credentials.revoke', (item: TokenTreeItem) => credentialsExplorer.revokeCredential(item));
	commands.registerCommand('as.views.credentials.details.tokens', async (item: CredentialsBaseTreeItem) => { credentialsExplorer.printTreeItemDetails(item); });

	// Menu Items
	context.subscriptions.push(commands.registerCommand('as.commandpalette.credentials.add', async () => { akkasls.addDockerCredentials(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.credentials.delete', async () => { akkasls.deleteDockerCredentials(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.auth.login', async () => { akkasls.login(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.auth.logout', async () => { akkasls.logout(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.deploy', async () => { akkasls.deployService(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.undeploy', async () => { akkasls.undeployService(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.expose', async () => { akkasls.exposeService(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.unexpose', async () => { akkasls.unexposeService(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.invites.inviteuser', async () => { akkasls.inviteUser(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.invites.deleteinvite', async () => { akkasls.deleteInvite(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.projects.local.start', async (uri: Uri) => { akkasls.startLocal(uri); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.projects.local.stop', async (uri: Uri) => { akkasls.stopLocal(uri); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.tokens.revoke', async () => { akkasls.revokeToken(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.templatewizard', async () => { TemplateWizard(); }));
}

export function deactivate() {
	aslogger.dispose();
}