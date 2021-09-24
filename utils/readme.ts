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

Manage the stateful serverless applications you build on [Akka Serverless](https://akkaserverless.com), without leaving your favorite IDE! With this VS Code extension you don't have to remember all the flags to deploy services, add docker credentials, remove that one hostname from your service because you can do it all through VS Code.

## Key features

### Insight into your projects

From the projects explorer you can see all the projects that you have access to and you can drill into services, members, and container registry credentials. You can find the ones you need to edit, you can add new ones, or even remove entries you no longer need with a few clicks rather than typing commands. Invite developers to your project? just click... Deploy a service to Akka Serverless? just click... Add a new HTTP route to your service? just click!

### Easier deployments

Through the extension you can deploy services to Akka Serverless, following the same type of wizard as in the [Akka Serverless Console](https://console.akkaserverless.com). From the same plugin, you can also get the logs of your service and tail them as you try out your service.

**What's new in this version?**  See the [change log](CHANGELOG.md) to find out!

## Getting started with the extension

### Install

Download the latest release from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=lightbend-labs.vscode-akkasls-tools)

### Dependencies

The Akka Serverless extension may need to invoke the following command line tools, depending on which features you use. You will need \`akkasls\` at minimum, and \`docker\` if you plan to use the extension to build applications rather than only browse.

## Commands and features

\`${extensionData.name}\` supports a number of commands to interact with Akka Serverless; these are accessible via the command menu (\`Ctrl+Shift+P\`) and the views that are contributed by the extension.

`;

for (let index = 0; index < extensionData.contributes.views.as.length; index++) {
    const element = extensionData.contributes.views.as[index];
    readmeContent += `### ${element.name}

${element.description}

`;
}

readmeContent += '## Configuration\n\n';

for (let index = 0; index < Object.keys(extensionData.contributes.configuration.properties).length; index++) {
    const element = extensionData.contributes.configuration.properties[Object.keys(extensionData.contributes.configuration.properties)[index]];
    readmeContent += `- \`${Object.keys(extensionData.contributes.configuration.properties)[index]}\`: ${element.description}\n`;
}

readmeContent += `
## Release notes

See the [change log](CHANGELOG.md).

## Contributing

We welcome all contributions! [Pull requests](https://github.com/lightbend-labs/vscode-akkasls-tools/pulls) are the preferred way to share your contributions. For major changes, please open [an issue](https://github.com/lightbend-labs/vscode-akkasls-tools/issues) first to discuss what you would like to change.

## Support

This project is provided on an as-is basis and is not covered by the Lightbend Support policy.

## License

See the [LICENSE](./LICENSE).
`;

writeFileSync('./README.md', readmeContent);
