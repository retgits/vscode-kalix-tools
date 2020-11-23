'use strict'

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// Internal dependencies
import { aslogger } from './utils/logger';
import * as deployServices from './cliwrapper/services/deploy';
import * as exposeServices from './cliwrapper/services/expose';
import * as undeployServices from './cliwrapper/services/undeploy';
import * as unexposeServices from './cliwrapper/services/unexpose';
import * as base from './views/projectexplorer/baseTreeItem';
import * as projects from './views/projectexplorer/explorer';
import * as status from './views/statusexplorer/explorer';
import * as tools from './views/toolsexplorer/explorer';
import * as service from './views/projectexplorer/serviceTreeItem';
import * as AkkaServerless from './akkasls'

export function activate(context: vscode.ExtensionContext) {
	let akkasls = new AkkaServerless.AkkaServerless()

	context.subscriptions.push(vscode.commands.registerCommand('as.services.deploy', async () => { deployServices.fromCLI() }));
	context.subscriptions.push(vscode.commands.registerCommand('as.services.expose', async () => { exposeServices.fromCLI() }));
	context.subscriptions.push(vscode.commands.registerCommand('as.services.undeploy', async () => { undeployServices.fromCLI() }));
	context.subscriptions.push(vscode.commands.registerCommand('as.services.unexpose', async () => { unexposeServices.fromCLI() }));

	const projectsTreeDataProvider = new projects.ProjectExplorer(akkasls);
	vscode.window.registerTreeDataProvider('asexplorer.projects', projectsTreeDataProvider);
	vscode.commands.registerCommand('asexplorer.projects.refresh', () => projectsTreeDataProvider.refresh())
	vscode.commands.registerCommand('asexplorer.projects.services.deploy', async (item: base.TreeItem) => service.deploy(item))
	vscode.commands.registerCommand('asexplorer.projects.services.undeploy', async (item: service.ServiceTreeItem) => service.undeploy(item))
	vscode.commands.registerCommand('asexplorer.projects.services.expose', async (item: service.ServiceTreeItem) => service.expose(item))
	vscode.commands.registerCommand('asexplorer.projects.services.unexpose', async (item: service.ServiceTreeItem) => service.unexpose(item))
	vscode.commands.registerCommand('asexplorer.projects.openbrowser', async (item: base.TreeItem) => projects.openInBrowser(item))
	vscode.commands.registerCommand('asexplorer.projects.details.projects', async (item: base.TreeItem) => projects.printDetails(item))
	vscode.commands.registerCommand('asexplorer.projects.details.services', async (item: base.TreeItem) => projects.printDetails(item))
	vscode.commands.registerCommand('asexplorer.projects.details.members', async (item: base.TreeItem) => projects.printDetails(item))
	vscode.commands.registerCommand('asexplorer.projects.details.invites', async (item: base.TreeItem) => projects.printDetails(item))

	const toolsTreeDataProvider = new tools.TreeDataProvider();
	vscode.window.registerTreeDataProvider('asexplorer.tools', toolsTreeDataProvider);
	vscode.commands.registerCommand('asexplorer.tools.refresh', () => toolsTreeDataProvider.refresh())

	const statusTreeDataProvider = new status.StatusExplorer();
	vscode.window.registerTreeDataProvider('asexplorer.status', statusTreeDataProvider);
	vscode.commands.registerCommand('asexplorer.status.refresh', () => statusTreeDataProvider.refresh())

}

export function deactivate() {
    aslogger.dispose()
}