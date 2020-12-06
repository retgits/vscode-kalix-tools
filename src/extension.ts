import { window, commands, ExtensionContext, Uri, workspace } from 'vscode';

// Internal dependencies
import { aslogger } from './utils/logger';

import { AkkaServerless } from './akkasls';
import { ProjectExplorer } from './components/views/projectexplorer/explorer';
import { StatusExplorer } from './components/views/statusexplorer/explorer';
import { ToolsExplorer } from './components/views/toolsexplorer/explorer';
import { ConfigExplorer } from './components/views/configexplorer/explorer';

import { ConfigBaseTreeItem } from './components/views/configexplorer/configBaseTreeItem';
import { ProjectBaseTreeItem } from './components/views/projectexplorer/projectBaseTreeItem';
import { ToolTreeItem } from './components/views/toolsexplorer/toolsTreeItem';
import { ServiceTreeItem, SERVICE_ITEM_TYPE } from './components/views/projectexplorer/serviceTreeItem';
import { InviteTreeItem } from './components/views/projectexplorer/inviteTreeItem';
import { DockerTreeItem, DOCKER_ITEM_TYPE } from './components/views/projectexplorer/dockerTreeItem';
import { TokenTreeItem } from './components/views/configexplorer/tokenTreeItem';

import { templateWizard } from './components/wizards/templateWizard';
import { shell } from './utils/shell/shell';

export function activate(context: ExtensionContext) {
	const akkasls = new AkkaServerless(shell);

	// Projects Tree
	const projectExplorer = new ProjectExplorer(akkasls);
	window.registerTreeDataProvider('as.views.projects', projectExplorer);
	commands.registerCommand('as.views.projects.refresh', () => projectExplorer.refresh());
	commands.registerCommand('as.views.projects.credentials.add', async (item: ProjectBaseTreeItem) => akkasls.addDockerCredentialsWizard(item.parentProjectID));
	commands.registerCommand('as.views.projects.credentials.delete', async (item: DockerTreeItem) => { if (item.label !== DOCKER_ITEM_TYPE) { akkasls.deleteDockerCredentials(item.parentProjectID, item.label); }});
	commands.registerCommand('as.views.projects.services.deploy', async (item: ProjectBaseTreeItem) => akkasls.deployServiceWizard(item.parentProjectID));
	commands.registerCommand('as.views.projects.services.undeploy', async (item: ServiceTreeItem) => { if (item.label !== SERVICE_ITEM_TYPE) { akkasls.undeployServiceWizard(item.parentProjectID, item.label); } });
	commands.registerCommand('as.views.projects.services.expose', async (item: ServiceTreeItem) => { if (item.label !== SERVICE_ITEM_TYPE) { akkasls.exposeServiceWizard(item.parentProjectID, item.label); } });
	commands.registerCommand('as.views.projects.services.unexpose', async (item: ServiceTreeItem) => { if (item.label !== SERVICE_ITEM_TYPE) { akkasls.exposeServiceWizard(item.parentProjectID, item.label); }});
	commands.registerCommand('as.views.projects.invites.inviteuser', async (item: ProjectBaseTreeItem) => akkasls.inviteUserWizard(item.parentProjectID));
	commands.registerCommand('as.views.projects.invites.deleteinvite', async (item: InviteTreeItem) => akkasls.deleteInvite(item.parentProjectID, item.invite.email));
	commands.registerCommand('as.views.projects.new', async () => akkasls.newProjectWizard());
	commands.registerCommand('as.views.projects.openbrowser', async (item: ProjectBaseTreeItem) => projectExplorer.openTreeItemInBrowser(item));
	commands.registerCommand('as.views.projects.details.projects', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.services', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.members', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.invites', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.credentials', async (item: ProjectBaseTreeItem) => projectExplorer.printTreeItemDetails(item));

	// Tools tree
	const toolsExplorer = new ToolsExplorer(shell);
	window.registerTreeDataProvider('as.views.tools', toolsExplorer);
	commands.registerCommand('as.views.tools.refresh', () => toolsExplorer.refresh());
	commands.registerCommand('as.views.tools.info', async (item: ToolTreeItem) => toolsExplorer.openTreeItemInBrowser(item));

	// Status tree	
	const statusExplorer = new StatusExplorer();
	window.registerTreeDataProvider('as.views.status', statusExplorer);
	commands.registerCommand('as.views.status.refresh', () => statusExplorer.refresh());
	commands.registerCommand('as.views.status.info', () => statusExplorer.openTreeItemInBrowser());
	context.subscriptions.push(commands.registerCommand('as.views.status.view', async () => { statusExplorer.openTreeItemInBrowser(); }));

	// Config Tree
	const configExplorer = new ConfigExplorer(akkasls);
	window.registerTreeDataProvider('as.views.tokens', configExplorer);
	commands.registerCommand('as.views.tokens.refresh', () => configExplorer.refresh());
	commands.registerCommand('as.views.tokens.revoke', (item: TokenTreeItem) => akkasls.revokeAuthToken(item.id));
	commands.registerCommand('as.views.tokens.details.tokens', async (item: ConfigBaseTreeItem) => { configExplorer.printTreeItemDetails(item); });

	// Menu Items
	context.subscriptions.push(commands.registerCommand('as.commandpalette.credentials.add', async () => { akkasls.addDockerCredentialsWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.credentials.delete', async () => { akkasls.deleteDockerCredentialsWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.auth.login', async () => { akkasls.login(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.auth.logout', async () => { akkasls.logout(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.deploy', async () => { akkasls.deployServiceWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.undeploy', async () => { akkasls.undeployServiceWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.expose', async () => { akkasls.exposeServiceWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.unexpose', async () => { akkasls.unexposeServiceWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.invites.inviteuser', async () => { akkasls.inviteUserWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.invites.deleteinvite', async () => { akkasls.deleteInviteWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.projects.local.start', async (uri: Uri) => { akkasls.startLocalProxy(uri.path, workspace.getConfiguration('akkaserverless')!.get<string>('dockerImageUser')!); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.projects.local.stop', async (uri: Uri) => { akkasls.stopLocalProxy(uri.path, workspace.getConfiguration('akkaserverless')!.get<string>('dockerImageUser')!); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.tokens.revoke', async () => { akkasls.revokeAuthTokenWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.templatewizard', async () => { templateWizard(); }));
}

export function deactivate() {
	aslogger.dispose();
}