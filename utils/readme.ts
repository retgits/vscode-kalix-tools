/*global require*/
/**
 * readme creates the text for the README
 *
 * You can run this file with:
 * `npm run utils:readme`
 */

import { writeFileSync } from 'fs';

export interface Package {
    name: string;
    displayName: string;
    description: string;
    version: string;
    homepage: string;
    license: string;
    icon: string;
    contributes: Contributes;
}

export interface Contributes {
    configuration: Configuration;
    views: Views;
    commands: Command[];
}

export interface Command {
    command: string;
    title: string;
    icon?: Icon;
    description: string;
    category?: string;
}

export interface Icon {
    light: string;
    dark: string;
}

export interface Configuration {
    title: string;
    properties: Properties;
}

export interface Properties {
    [key: string]: PropertyDetails;
}

export interface PropertyDetails {
    type: string;
    description: string;
}

export interface Views {
    as: View[];
}

export interface View {
    id: string;
    name: string;
    description: string;
}

// Read the package
const extensionData: Package = require('../package.json');

// Name

let readmeContent: string = `# ${extensionData.displayName}

[![version](https://img.shields.io/badge/version-${extensionData.version}-brightgreen)](https://img.shields.io/badge/version-${extensionData.version}-brightgreen)

> ${extensionData.description}

Manage the stateful serverless services you build on [Akka Serverless](https://akkaserverless.com), without leaving your favorite IDE! With this VS Code extension you don't have to remember all the flags to deploy services, add docker credentials, remove that one hostname from your service because you can do it all through VS Code.

## Key features

### Insight into your projects

From the projects explorer you can see all the projects that you have access to and you can drill into services, members, and container registry credentials. You can find the ones you need to edit, you can add new ones, or even remove entries you no longer need with a few clicks rather than typing commands. Invite developers to your project? just click... Deploy a service to Akka Serverless? just click... Add a new HTTP route to your service? just click!

### Easier deployments

Through the extension you can deploy services to Akka Serverless, following the same type of wizard as in the [Akka Serverless Console](https://console.akkaserverless.com). From the same plugin, you can also get the logs of your service and tail them as you try out your service.

**What's new in this version?**  See the [change log](CHANGELOG.md) to find out!

## Getting started with the extension

To get started, download the latest release from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=lightbend-labs.vscode-akkasls-tools). You'll also need \`akkasls\` and \`docker\` (if you plan to use the extension to build applications rather than only browse).

## Release notes

See the [change log](CHANGELOG.md).

## Contributing

We welcome all contributions! [Pull requests](https://github.com/lightbend-labs/vscode-akkasls-tools/pulls) are the preferred way to share your contributions. For major changes, please open [an issue](https://github.com/lightbend-labs/vscode-akkasls-tools/issues) first to discuss what you would like to change.

## Support

This project is an [incubating project](https://developer.lightbend.com/docs/introduction/getting-help/support-terminology.html).

## License

See the [LICENSE](./LICENSE).
`;

writeFileSync('./README.md', readmeContent);
