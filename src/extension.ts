import { ExtensionContext, Uri, commands, window } from 'vscode';
import { logger } from './utils/logger';
import { AkkaServerless } from './akkasls';
import { ProjectExplorer } from './plugins/projectexplorer/projectExplorer';
import { StatusExplorer } from './plugins/statusexplorer/statusExplorer';
import { ToolsExplorer } from './plugins/toolsexplorer/toolsExplorer';
import { ConfigExplorer } from './plugins/configexplorer/configExplorer';
import { BaseConfigExplorerItem } from './plugins/configexplorer/baseConfigExplorerItem';
import { BaseProjectExplorerItem } from './plugins/projectexplorer/baseProjectExplorerItem';
import { ToolsExplorerItem } from './plugins/toolsexplorer/toolsExplorerItem';
import { ServiceItem } from './plugins/projectexplorer/serviceItem';
import { InviteItem } from './plugins/projectexplorer/inviteItem';
import { DockerCredentialItem } from './plugins/projectexplorer/dockerCredentialItem';
import { AuthTokenItem } from './plugins/configexplorer/authTokenItem';
import { templateWizard } from './plugins/wizards/templateWizard';

export function activate(context: ExtensionContext): void {
	const akkasls = new AkkaServerless();

	const projectExplorer = new ProjectExplorer(akkasls);
	window.registerTreeDataProvider('as.views.projects', projectExplorer);
	commands.registerCommand('as.views.projects.details.dockercredentials', async (item: BaseProjectExplorerItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.invites', async (item: BaseProjectExplorerItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.members', async (item: BaseProjectExplorerItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.projects', async (item: BaseProjectExplorerItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.details.services', async (item: BaseProjectExplorerItem) => projectExplorer.printTreeItemDetails(item));
	commands.registerCommand('as.views.projects.dockercredentials.add', async (item: BaseProjectExplorerItem) => akkasls.addDockerCredentialsWizard(item.parentProjectID));
	commands.registerCommand('as.views.projects.dockercredentials.delete', async (item: DockerCredentialItem) => akkasls.deleteDockerCredentials(item.parentProjectID, item.label));
	commands.registerCommand('as.views.projects.invites.deleteinvite', async (item: InviteItem) => akkasls.deleteInvite(item.parentProjectID, item.invite.email));
	commands.registerCommand('as.views.projects.invites.inviteuser', async (item: BaseProjectExplorerItem) => akkasls.inviteUserWizard(item.parentProjectID));
	commands.registerCommand('as.views.projects.new', async () => akkasls.newProjectWizard());
	commands.registerCommand('as.views.projects.openbrowser', async (item: BaseProjectExplorerItem) => projectExplorer.openTreeItemInBrowser(item));
	commands.registerCommand('as.views.projects.refresh', () => projectExplorer.refresh());
	commands.registerCommand('as.views.projects.services.deploy', async (item: BaseProjectExplorerItem) => akkasls.deployServiceWizard(item.parentProjectID));
	commands.registerCommand('as.views.projects.services.expose', async (item: ServiceItem) => akkasls.exposeServiceWizard(item.parentProjectID, item.label));
	commands.registerCommand('as.views.projects.services.undeploy', async (item: ServiceItem) => akkasls.undeployServiceWizard(item.parentProjectID, item.label));
	commands.registerCommand('as.views.projects.services.unexpose', async (item: ServiceItem) => akkasls.unexposeServiceWizard(item.parentProjectID, item.label));

	const toolsExplorer = new ToolsExplorer();
	window.registerTreeDataProvider('as.views.tools', toolsExplorer);
	commands.registerCommand('as.views.tools.info', async (item: ToolsExplorerItem) => toolsExplorer.openTreeItemInBrowser(item));
	commands.registerCommand('as.views.tools.refresh', () => toolsExplorer.refresh());

	const statusExplorer = new StatusExplorer();
	window.registerTreeDataProvider('as.views.status', statusExplorer);
	commands.registerCommand('as.views.status.info', () => statusExplorer.openTreeItemInBrowser());
	commands.registerCommand('as.views.status.refresh', () => statusExplorer.refresh());
	context.subscriptions.push(commands.registerCommand('as.views.status.view', async () => { statusExplorer.openTreeItemInBrowser(); }));

	const configExplorer = new ConfigExplorer(akkasls);
	window.registerTreeDataProvider('as.views.tokens', configExplorer);
	commands.registerCommand('as.views.tokens.details.tokens', async (item: BaseConfigExplorerItem) => { configExplorer.printTreeItemDetails(item); });
	commands.registerCommand('as.views.tokens.refresh', () => configExplorer.refresh());
	commands.registerCommand('as.views.tokens.revoke', (item: AuthTokenItem) => akkasls.revokeAuthToken(item.id));

	// Menu Items
	context.subscriptions.push(commands.registerCommand('as.commandpalette.auth.login', async () => { akkasls.login(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.auth.logout', async () => { akkasls.logout(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.deploy', async () => { akkasls.deployServiceWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.dockercredentials.add', async () => { akkasls.addDockerCredentialsWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.dockercredentials.delete', async () => { akkasls.deleteDockerCredentialsWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.expose', async () => { akkasls.exposeServiceWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.invites.deleteinvite', async () => { akkasls.deleteInviteWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.invites.inviteuser', async () => { akkasls.inviteUserWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.projects.local.start', async (uri: Uri) => { akkasls.startLocalProxy(uri.path); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.projects.local.stop', async (uri: Uri) => { akkasls.stopLocalProxy(uri.path); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.templatewizard', async () => { templateWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.tokens.revoke', async () => { akkasls.revokeAuthTokenWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.undeploy', async () => { akkasls.undeployServiceWizard(); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.unexpose', async () => { akkasls.unexposeServiceWizard(); }));
}

export function deactivate(): void {
	logger.dispose();
}