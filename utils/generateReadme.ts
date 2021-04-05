/**
 * generateReadMe creates the text for the "commands and features" and "extensions" section of the README
 * so that it can be copied and pasted when new commands are added, old ones are removed, or existing ones
 * are updated.
 *
 * You can run this file with:
 * `npm run utils:readme`
 */

interface Command {
    title: string;
    description: string;
}

const generalCommands: Command[] = [];
const toolsExplorerCommands: Command[] = [];
const projectExplorerCommands: Command[] = [];
const statusExplorerCommands: Command[] = [];
const accountExplorerCommands: Command[] = [];

// Read the package
const extensionData = require('../package.json');

// Loop through commands and store them either in a views map or a general commands array
const items = extensionData.contributes.commands;

items.forEach(function (element: any) {
    if (element.command.includes('commandpalette')) {
        generalCommands.push({
            title: element.title,
            description: element.description
        });
    } else if (element.command.includes('projectExplorer')) {
        projectExplorerCommands.push({
            title: element.title,
            description: element.description
        });
    } else if (element.command.includes('accountExplorer')) {
        accountExplorerCommands.push({
            title: element.title,
            description: element.description
        });
    } else if (element.command.includes('statusExplorer')) {
        statusExplorerCommands.push({
            title: element.title,
            description: element.description
        });
    } else if (element.command.includes('toolsExplorer')) {
        toolsExplorerCommands.push({
            title: element.title,
            description: element.description
        });
    }
});

console.log('### General commands\n');
generalCommands.forEach(function (command: Command) {
    console.log(`* \`${command.title}\`: ${command.description}`);
});
console.log('');

console.log('### Projects\n');
projectExplorerCommands.forEach(function (command: Command) {
    console.log(`* \`${command.title}\`: ${command.description}`);
});
console.log('');

console.log('### Accounts & Tokens\n');
accountExplorerCommands.forEach(function (command: Command) {
    console.log(`* \`${command.title}\`: ${command.description}`);
});
console.log('');

console.log('### Status\n');
statusExplorerCommands.forEach(function (command: Command) {
    console.log(`* \`${command.title}\`: ${command.description}`);
});
console.log('');

console.log('### Tools\n');
toolsExplorerCommands.forEach(function (command: Command) {
    console.log(`* \`${command.title}\`: ${command.description}`);
});
console.log('');

// Configuration
const configItems = extensionData.contributes.configuration.properties;
const configElements = Object.keys(configItems);

console.log('## Extension Settings\n');
configElements.forEach((element) => {
    console.log(`* \`${element}\`: ${configItems[element]['description']}`);
});