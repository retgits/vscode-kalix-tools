// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Internal dependencies
import { config } from './config';
import { StatusExplorer } from './components/statusexplorer/statusexplorer';
import { ToolsExplorer, ToolNode } from './components/toolsexplorer/toolsexplorer';
import { AccountExplorer, AccountNode, AuthTokenNode } from './components/accountexplorer/accountexplorer';
import { revokeAuthTokenNode, createAuthTokenNode } from './components/accountexplorer/tokenhandler';
import { InviteNode, ProjectExplorer, ProjectNode, ServiceNode, ContainerRegistryCredentialNode } from './components/projectexplorer/projectexplorer';
import { createNewProject } from './components/projectexplorer/projecthandler';
import { showServiceLogs, createService, serviceDelete, serviceExpose, serviceUnexpose } from './components/projectexplorer/serviceshandler';
import { addRegistryCredentials, deleteRegistryCredentials } from './components/projectexplorer/credentialshandler';
import { sendInvitation, deleteInvitation } from './components/projectexplorer/inviteshandler';
import { openBrowser } from './browser';
import { logger } from './logger';
import { npx, npm } from './components/codegeneration/javascript';
import { maven } from './components/codegeneration/java';

export function activate(context: vscode.ExtensionContext): void {
	// Menu Items
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.console', async () => { openBrowser(config.urls.console); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.documentation', async () => { openBrowser(config.urls.documentation); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.forum', async () => { openBrowser(config.urls.forum); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.ideas', async () => { openBrowser(config.urls.ideas); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.statuspage', async () => { openBrowser(config.urls.statuspage); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.entities.generateNpx', async () => { npx(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.entities.generateNpm', async () => { npm(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.entities.generateMaven', async () => { maven(); }));

	// Tools Explorer
	const toolsExplorer = new ToolsExplorer();
	vscode.window.registerTreeDataProvider('as.toolsExplorer', toolsExplorer);
	vscode.commands.registerCommand('as.toolsExplorer.info', async (item: ToolNode) => toolsExplorer.openToolInfoPage(item));
	vscode.commands.registerCommand('as.toolsExplorer.refresh', () => toolsExplorer.refresh());

	// Status Explorer
	const statusExplorer = new StatusExplorer();
	vscode.window.registerTreeDataProvider('as.statusExplorer', statusExplorer);
	vscode.commands.registerCommand('as.statusExplorer.info',  () => statusExplorer.openStatusInfoPage());
	vscode.commands.registerCommand('as.statusExplorer.refresh', () => statusExplorer.refresh());

	// Account Explorer
	const accountExplorer = new AccountExplorer();
	vscode.window.registerTreeDataProvider('as.accountExplorer', accountExplorer);
	vscode.commands.registerCommand('as.accountExplorer.tokenInfo',  (item: AccountNode) => accountExplorer.print(item));
	vscode.commands.registerCommand('as.accountExplorer.tokenRevoke',  async (item: AuthTokenNode) => {
		const res = await revokeAuthTokenNode(item);
		if (res !== undefined) {
			accountExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.accountExplorer.tokenCreate', async () => {
		const res = await createAuthTokenNode();
		if (res !== undefined) {
			accountExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.accountExplorer.refresh', () => accountExplorer.refresh());

	// Project Explorer
	const projectExplorer = new ProjectExplorer();
	vscode.window.registerTreeDataProvider('as.projectExplorer', projectExplorer);
	vscode.commands.registerCommand('as.projectExplorer.info',  (item: ProjectNode) => projectExplorer.print(item));
	vscode.commands.registerCommand('as.projectExplorer.serviceLogs',  (item: ServiceNode) => showServiceLogs(item));
	vscode.commands.registerCommand('as.projectExplorer.projectCreate', async () => {
		const res = await createNewProject();
		if (res !== undefined) {
			projectExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.projectExplorer.serviceCreate', async (item: ProjectNode) => {
		const res = await createService(item);
		if (res !== undefined) {
			projectExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.projectExplorer.serviceDelete', async (item: ServiceNode) => {
		const res = await serviceDelete(item);
		if (res !== undefined) {
			projectExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.projectExplorer.serviceExpose', async (item: ServiceNode) => {
		const res = await serviceExpose(item);
		if (res !== undefined) {
			projectExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.projectExplorer.serviceUnexpose', async (item: ServiceNode) => {
		const res = await serviceUnexpose(item);
		if (res !== undefined) {
			projectExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.projectExplorer.registryCredentialsCreate', async (item: ProjectNode) => {
		const res = await addRegistryCredentials(item);
		if (res !== undefined) {
			projectExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.projectExplorer.registryCredentialsDelete', async (item: ContainerRegistryCredentialNode) => {
		const res = await deleteRegistryCredentials(item);
		if (res !== undefined) {
			projectExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.projectExplorer.inviteCreate', async (item: ProjectNode) => {
		const res = await sendInvitation(item);
		if (res !== undefined) {
			projectExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.projectExplorer.inviteDelete', async (item: InviteNode) => {
		const res = await deleteInvitation(item);
		if (res !== undefined) {
			projectExplorer.refresh();
		}
	});
	vscode.commands.registerCommand('as.projectExplorer.refresh', () => projectExplorer.refresh());
}

export function deactivate(): void {
	// Dispose of the logger
	logger.dispose();
}