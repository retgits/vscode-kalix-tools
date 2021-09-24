import * as vscode from 'vscode';

export const URLS = {
    console: 'https://console.akkaserverless.com',
    documentation: 'https://docs.akkaserverless.com',
    forum: 'https://discuss.lightbend.com/c/akka-serverless/40',
    ideas: 'https://ideas.akkaserverless.com',
    statuspage: 'https://status.akkaserverless.com/',
    statusapi: 'https://statuspal.io/api/v1/status_pages/cloudstate-com/status',
};

export const TOOLS = [
    {
        name: 'akkasls',
        versionCmd: 'version',
        toolTip: 'The Akka Serverless CLI is needed to perform most actions of this plugin',
        infoURL: 'https://developer.lightbend.com/docs/akka-serverless/akkasls/install-akkasls.html',
        updateURL: 'https://downloads.akkaserverless.com/latest/version.txt',
        currentVersion: ''
    },
    {
        name: 'docker',
        versionCmd: 'version --format \'{{.Client.Version}}\'',
        toolTip: 'The docker CLI is needed to build and run services locally',
        infoURL: 'https://docs.docker.com/desktop/',
        updateURL: '',
        currentVersion: ''
    }
];

// Icons
export const OKAY_ICON = new vscode.ThemeIcon('pass');
export const ERROR_ICON = new vscode.ThemeIcon('error');

// Context Menu Values
export const TOOLS_CONTEXT_VALUE = 'Tools';
export const TOKEN_ITEM_TYPE = 'Tokens';
export const REGISTRY_CREDENTIALS_ITEM_TYPE = 'Credentials';
export const INVITE_ITEM_TYPE = 'Invites';
export const MEMBER_ITEM_TYPE = 'Members';
export const PROJECT_ITEM_TYPE = 'Projects';
export const SERVICE_ITEM_TYPE = 'Services';