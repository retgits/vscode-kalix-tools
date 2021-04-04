export const config = {
    urls: {
        console: 'https://console.akkaserverless.com',
        documentation: 'https://docs.akkaserverless.com',
        forum: 'https://discuss.lightbend.com/c/akka-serverless-and-cloudstate/40',
        ideas: 'https://ideas.akkaserverless.com',
        statuspage: 'https://status.akkaserverless.com/',
        statusapi: 'https://statuspal.io/api/v1/status_pages/cloudstate-com/status',
    },
    tools: [
        {
            name: 'akkasls',
            versionCmd: 'version',
            toolTip: 'The Akka Serverless CLI is needed to perform most actions of this plugin',
            infoURL: 'https://developer.lightbend.com/docs/akka-serverless/getting-started/set-up-development-env.html#_akka_serverless_cli',
            updateURL: 'https://downloads.lbcs.io/stable/version.txt',
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
    ]
};