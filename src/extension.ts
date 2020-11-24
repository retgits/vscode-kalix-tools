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
import * as toolitem from './views/toolsexplorer/toolsTreeItem';
import * as service from './views/projectexplorer/serviceTreeItem';
import * as inviteUser from './cliwrapper/roles/invitations/inviteuser';
import * as AkkaServerless from './akkasls'

export function activate(context: vscode.ExtensionContext) {
	const akkasls = new AkkaServerless.AkkaServerless()
	const projectsTreeDataProvider = new projects.ProjectExplorer(akkasls);
	const toolsTreeDataProvider = new tools.TreeDataProvider();
	const statusTreeDataProvider = new status.StatusExplorer();

	context.subscriptions.push(vscode.commands.registerCommand('as.services.deploy', async () => { deployServices.fromCLI(projectsTreeDataProvider) }));
	context.subscriptions.push(vscode.commands.registerCommand('as.services.expose', async () => { exposeServices.fromCLI(projectsTreeDataProvider) }));
	context.subscriptions.push(vscode.commands.registerCommand('as.services.undeploy', async () => { undeployServices.fromCLI(projectsTreeDataProvider) }));
	context.subscriptions.push(vscode.commands.registerCommand('as.services.unexpose', async () => { unexposeServices.fromCLI(projectsTreeDataProvider) }));
	context.subscriptions.push(vscode.commands.registerCommand('as.invites.inviteuser', async () => { inviteUser.fromCLI(projectsTreeDataProvider) }));
	context.subscriptions.push(vscode.commands.registerCommand('asexplorer.status.view', async () => { status.openStatusPage() }));

	vscode.window.registerTreeDataProvider('asexplorer.projects', projectsTreeDataProvider);
	vscode.commands.registerCommand('asexplorer.projects.refresh', () => projectsTreeDataProvider.refresh())
	vscode.commands.registerCommand('asexplorer.projects.services.deploy', async (item: base.TreeItem) => projects.deploy(item, projectsTreeDataProvider))
	vscode.commands.registerCommand('asexplorer.projects.services.undeploy', async (item: service.ServiceTreeItem) => projects.undeploy(item, projectsTreeDataProvider))
	vscode.commands.registerCommand('asexplorer.projects.services.expose', async (item: service.ServiceTreeItem) => projects.expose(item, projectsTreeDataProvider))
	vscode.commands.registerCommand('asexplorer.projects.services.unexpose', async (item: service.ServiceTreeItem) => projects.unexpose(item, projectsTreeDataProvider))
	vscode.commands.registerCommand('asexplorer.projects.openbrowser', async (item: base.TreeItem) => projects.openInBrowser(item))
	vscode.commands.registerCommand('asexplorer.projects.details.projects', async (item: base.TreeItem) => projects.printDetails(item))
	vscode.commands.registerCommand('asexplorer.projects.details.services', async (item: base.TreeItem) => projects.printDetails(item))
	vscode.commands.registerCommand('asexplorer.projects.details.members', async (item: base.TreeItem) => projects.printDetails(item))
	vscode.commands.registerCommand('asexplorer.projects.details.invites', async (item: base.TreeItem) => projects.printDetails(item))
	vscode.commands.registerCommand('asexplorer.projects.new', async () => projects.newProject(projectsTreeDataProvider))
	vscode.commands.registerCommand('asexplorer.projects.invites.inviteuser', async (item: base.TreeItem) => projects.inviteUser(item, projectsTreeDataProvider))
	
	vscode.window.registerTreeDataProvider('asexplorer.tools', toolsTreeDataProvider);
	vscode.commands.registerCommand('asexplorer.tools.refresh', () => toolsTreeDataProvider.refresh())
	vscode.commands.registerCommand('asexplorer.tools.info', async (item: toolitem.ToolTreeItem) => toolsTreeDataProvider.openPage(item))

	vscode.window.registerTreeDataProvider('asexplorer.status', statusTreeDataProvider);
	vscode.commands.registerCommand('asexplorer.status.refresh', () => statusTreeDataProvider.refresh())

}

export function deactivate() {
    aslogger.dispose()
}