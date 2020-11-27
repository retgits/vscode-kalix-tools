'use strict';

import * as vscode from 'vscode';

// Internal dependencies
import { aslogger } from './utils/logger';

import * as projects from './views/projectexplorer/explorer';
import * as status from './views/statusexplorer/explorer';
import * as tools from './views/toolsexplorer/explorer';

import * as base from './views/projectexplorer/baseTreeItem';
import * as toolitem from './views/toolsexplorer/toolsTreeItem';
import * as service from './views/projectexplorer/serviceTreeItem';

import * as AkkaServerless from './akkasls';

export function activate(context: vscode.ExtensionContext) {
	const akkasls = new AkkaServerless.AkkaServerless();

	// Projects Tree
	const projectExplorer = new projects.ProjectExplorer(akkasls);
	vscode.window.registerTreeDataProvider('as.views.projects', projectExplorer);
	vscode.commands.registerCommand('as.views.projects.refresh', () => projectExplorer.refresh());
	vscode.commands.registerCommand('as.views.projects.services.deploy', async (item: base.TreeItem) => projectExplorer.deployService(item));
	vscode.commands.registerCommand('as.views.projects.services.undeploy', async (item: service.ServiceTreeItem) => projectExplorer.undeployService(item));
	vscode.commands.registerCommand('as.views.projects.services.expose', async (item: service.ServiceTreeItem) => projectExplorer.exposeService(item));
	vscode.commands.registerCommand('as.views.projects.services.unexpose', async (item: service.ServiceTreeItem) => projectExplorer.unexposeService(item));
	vscode.commands.registerCommand('as.views.projects.invites.inviteuser', async (item: base.TreeItem) => projectExplorer.inviteUser(item));
	vscode.commands.registerCommand('as.views.projects.new', async () => projectExplorer.newProject());
	vscode.commands.registerCommand('as.views.projects.openbrowser', async (item: base.TreeItem) => projectExplorer.openTreeItemInBrowser(item));
	vscode.commands.registerCommand('as.views.projects.details.projects', async (item: base.TreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.services', async (item: base.TreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.members', async (item: base.TreeItem) => projectExplorer.printTreeItemDetails(item));
	vscode.commands.registerCommand('as.views.projects.details.invites', async (item: base.TreeItem) => projectExplorer.printTreeItemDetails(item));

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

	// Menu Items
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.auth.login', async () => { akkasls.login(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.auth.logout', async () => { akkasls.logout(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.deploy', async () => { akkasls.deployService(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.undeploy', async () => { akkasls.undeployService(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.expose', async () => { akkasls.exposeService(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.unexpose', async () => { akkasls.unexposeService(); }));
	context.subscriptions.push(vscode.commands.registerCommand('as.commandpalette.invites.inviteuser', async () => { akkasls.inviteUser(); }));
}

export function deactivate() {
	aslogger.dispose();
}