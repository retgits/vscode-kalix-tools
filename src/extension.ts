import * as vscode from 'vscode';
import { AccountExplorer } from './components/accountexplorer/accountexplorer';
import { TokenExplorer } from './components/tokenexplorer/tokenexplorer';
import { StatusExplorer } from './components/statusexplorer/statusexplorer';
import { ToolNode } from './components/toolsexplorer/toolnode';
import { ToolsExplorer } from './components/toolsexplorer/toolsexplorer';
import { logger } from './utils/logger';
import { TokenNode } from './components/tokenexplorer/tokennode';
import { handleAddAuthToken, handleRevokeAuthToken } from './components/tokenexplorer/tokenhandler';
import { ProjectExplorer } from './components/projectexplorer/projectexplorer';
import { login } from './components/akkasls/auth/login';
import { getConfiguration } from './utils/config';
import { openBrowser } from './utils/browser';
import { URLS } from './utils/constants';
import { ProjectExplorerNode } from './components/projectexplorer/projectexplorernode';
import { handleAddRegistryCredentials, handleDeleteRegistryCredentials } from './components/projectexplorer/containerregistrycredentialhandler';
import { ContainerRegistryCredentialNode } from './components/projectexplorer/containerregistrycredentialnode';
import { InviteNode } from './components/projectexplorer/invitenode';
import { handleDeleteInvitation, handleSendInvitation } from './components/projectexplorer/invitehandler';
import { handleDeleteProject, handleNewProject } from './components/projectexplorer/projecthandler';
import { ProjectNode } from './components/projectexplorer/projectnode';
import { handleCreateService, handleDeleteService, handleServiceExpose, handleServiceUnexpose } from './components/projectexplorer/servicehandler';
import { ServiceNode } from './components/projectexplorer/servicenode';
import { showServiceLogs } from './components/projectexplorer/logshandler';
import { handleDownloadQuickstart } from './components/quickstart/quickstarthandler';
import { MemberNode } from './components/projectexplorer/membernode';
import { handleCreateSecret, handleDeleteSecret } from './components/projectexplorer/secrethandler';
import { SecretNode } from './components/projectexplorer/secretnode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	// Project Explorer
	const projectExplorer = new ProjectExplorer();
	vscode.window.registerTreeDataProvider('as.projectExplorer', projectExplorer);
	vscode.commands.registerCommand('as.projectExplorer.refresh', () => projectExplorer.refresh());
	vscode.commands.registerCommand('as.projectExplorer.addRegistryCredentials', async (item: ProjectExplorerNode) => { await handleAddRegistryCredentials(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.deleteRegistryCredentials', async (item: ContainerRegistryCredentialNode) => { await handleDeleteRegistryCredentials(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.addInvite', async (item: ProjectExplorerNode) => { await handleSendInvitation(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.deleteInvite', async (item: InviteNode) => { await handleDeleteInvitation(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.inviteInfo', async (item: InviteNode) => { await item.print(); });
	vscode.commands.registerCommand('as.projectExplorer.addProject', async () => { await handleNewProject(projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.deleteProject', async (item: ProjectNode) => { await handleDeleteProject(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.projectInfo', async (item: ProjectNode) => { await item.print(); });
	vscode.commands.registerCommand('as.projectExplorer.deployService', async (item: ProjectExplorerNode) => { await handleCreateService(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.deleteService', async (item: ServiceNode) => { await handleDeleteService(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.exposeService', async (item: ServiceNode) => { await handleServiceExpose(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.unexposeService', async (item: ServiceNode) => { await handleServiceUnexpose(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.serviceLogs', async (item: ServiceNode) => { await showServiceLogs(item); });
	vscode.commands.registerCommand('as.projectExplorer.serviceInfo', async (item: ServiceNode) => { await item.print(); });
	vscode.commands.registerCommand('as.projectExplorer.memberInfo', async (item: MemberNode) => { await item.print(); });
	vscode.commands.registerCommand('as.projectExplorer.addSecret', async (item: ProjectExplorerNode) => { await handleCreateSecret(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.deleteSecret', async (item: SecretNode) => { await handleDeleteSecret(item, projectExplorer); });
	vscode.commands.registerCommand('as.projectExplorer.secretInfo', async (item: SecretNode) => { await item.print(); });

	// Tools Explorer
	const toolsExplorer = new ToolsExplorer();
	vscode.window.registerTreeDataProvider('as.toolsExplorer', toolsExplorer);
	vscode.commands.registerCommand('as.toolsExplorer.refresh', () => toolsExplorer.refresh());
	vscode.commands.registerCommand('as.toolsExplorer.info', async (item: ToolNode) => toolsExplorer.openToolInfoPage(item));

	// Status Explorer
	const statusExplorer = new StatusExplorer();
	vscode.window.registerTreeDataProvider('as.statusExplorer', statusExplorer);
	vscode.commands.registerCommand('as.statusExplorer.info', () => statusExplorer.openStatusInfoPage());
	vscode.commands.registerCommand('as.statusExplorer.refresh', () => statusExplorer.refresh());

	// Account Explorer
	const accountExplorer = new AccountExplorer();
	vscode.window.registerTreeDataProvider('as.accountExplorer', accountExplorer);
	vscode.commands.registerCommand('as.accountExplorer.refresh', () => accountExplorer.refresh());

	// Token Explorer
	const tokenExplorer = new TokenExplorer();
	vscode.window.registerTreeDataProvider('as.tokenExplorer', tokenExplorer);
	vscode.commands.registerCommand('as.tokenExplorer.refresh', () => tokenExplorer.refresh());
	vscode.commands.registerCommand('as.tokenExplorer.info', (item: TokenNode) => item.print());
	vscode.commands.registerCommand('as.tokenExplorer.revoke', async (item: TokenNode) => { await handleRevokeAuthToken(item, tokenExplorer); });
	vscode.commands.registerCommand('as.tokenExplorer.add', async () => { await handleAddAuthToken(tokenExplorer); });

	// Menu items
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.auth.login', async () => { login(getConfiguration()); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.console', async () => { openBrowser(URLS.console); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.documentation', async () => { openBrowser(URLS.documentation); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.forum', async () => { openBrowser(URLS.forum); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.ideas', async () => { openBrowser(URLS.ideas); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.statuspage', async () => { openBrowser(URLS.statuspage); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.quickstart', async () => { handleDownloadQuickstart(); }));
}

export function deactivate(): void {
	logger.dispose();
}
