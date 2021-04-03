import { ExtensionContext, commands } from 'vscode';
import { config } from './config';
import { openBrowser } from './browser';

export function activate(context: ExtensionContext): void {
	// Menu Items
	context.subscriptions.push(commands.registerCommand('as.commandpalette.browser.console', async () => { openBrowser(config.urls.console); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.browser.documentation', async () => { openBrowser(config.urls.documentation); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.browser.forum', async () => { openBrowser(config.urls.forum); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.browser.ideas', async () => { openBrowser(config.urls.ideas); }));
	context.subscriptions.push(commands.registerCommand('as.commandpalette.browser.statuspage', async () => { openBrowser(config.urls.statuspage); }));
}

export function deactivate(): void {

}