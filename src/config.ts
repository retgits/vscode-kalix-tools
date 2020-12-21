export const config = {
    tools: [
        {
            name: 'akkasls',
            versionCmd: 'version',
            toolTip: 'The Akka Serverless CLI is needed to perform most actions of this plugin',
            infoURL: 'https://docs.cloudstate.com/getting-started/set-up-development-env.html#_cloudstate_cli',
            updateURL: 'https://downloads.lbcs.io/stable/version.txt',
            currentVersion: ''
        },
        {
            name: 'docker',
            versionCmd: 'version --format \'{{.Client.Version}}\'',
            toolTip: 'The docker CLI is needed to build apps and run apps locally',
            infoURL: 'https://docs.docker.com/desktop/',
            updateURL: '',
            currentVersion: ''
        },
        {
            name: 'git',
            versionCmd: '--version',
            toolTip: 'The git CLI is needed to clone template projects',
            infoURL: 'https://git-scm.com/downloads',
            updateURL: '',
            currentVersion: ''
        },
        {
            name: 'serverless',
            versionCmd: '--version',
            toolTip: 'The Serverless Framework CLI is needed to install projects',
            infoURL: 'https://www.serverless.com/framework/docs/getting-started/',
            updateURL: '',
            currentVersion: ''
        }
    ],
    statusPageURL: 'https://status.cloudstate.com/',
    statusPageAPI: 'https://statuspal.io/api/v1/status_pages/cloudstate-com/status',
    templateRepoName: 'https://github.com/retgits/akkasls-templates',
    consoleURL: 'https://console.cloudstate.com/project'
};