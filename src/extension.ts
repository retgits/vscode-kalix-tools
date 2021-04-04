// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Internal dependencies
import { config } from './config';
import { StatusExplorer } from './components/statusexplorer/statusexplorer';
import { ToolsExplorer, ToolNode } from './components/toolsexplorer/toolsexplorer';
import { AccountExplorer, AccountNode } from './components/accountexplorer/accountexplorer';
import { ProjectExplorer, ProjectNode, ServiceNode } from './components/projectexplorer/projectexplorer';
import { showServiceLogs } from './components/projectexplorer/servicelogs';
import { openBrowser } from './browser';
import { logger } from './logger';

export function activate(context: vscode.ExtensionContext): void {
	// Menu Items
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.console', async () => { openBrowser(config.urls.console); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.documentation', async () => { openBrowser(config.urls.documentation); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.forum', async () => { openBrowser(config.urls.forum); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.ideas', async () => { openBrowser(config.urls.ideas); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.browser.statuspage', async () => { openBrowser(config.urls.statuspage); }));

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
	vscode.commands.registerCommand('as.accountExplorer.refresh', () => accountExplorer.refresh());

	// Project Explorer
	const projectExplorer = new ProjectExplorer();
	vscode.window.registerTreeDataProvider('as.projectExplorer', projectExplorer);
	vscode.commands.registerCommand('as.projectExplorer.info',  (item: ProjectNode) => projectExplorer.print(item));
	vscode.commands.registerCommand('as.projectExplorer.serviceLogs',  (item: ServiceNode) => showServiceLogs(item));
	vscode.commands.registerCommand('as.projectExplorer.refresh', () => projectExplorer.refresh());
}

export function deactivate(): void {
	// Dispose of the logger
	logger.dispose();
}