/**
 * generateReadMe creates the text for the "commands and features" and "extensions" section of the README
 * so that it can be copied and pasted when new commands are added, old ones are removed, or existing ones
 * are updated.
 * 
 * You can run this file with:
 * `npm run gen:readme`
 */

// Read the package
let extensionData = require('../package.json');

// Create views map
let viewsMap: Map<string, string[]> = new Map();
let viewItems = extensionData.contributes.views.as;

viewItems.forEach(function (element: any) {
    viewsMap.set(element.id, []);
});

// Loop through commands and store them either in a views map or a general commands array
let commandItems = extensionData.contributes.commands;
let generalCommands: string[] = [];

commandItems.forEach(function (element: any) {
    if (element.hasOwnProperty('category')) {
        generalCommands.push(`* \`Akka Serverless: ${element.title}\` - ${element.description}`);
    } else {
        let view = element.command.split('.');
        let viewname = `${view[0]}.${view[1]}.${view[2]}`;
        let commands = viewsMap.get(viewname);
        commands?.push(`${element.title}||${element.description}`);
        viewsMap.set(viewname, commands!);
    }
});

generalCommands = sortStringArray(generalCommands);

console.log('### General commands\n');
generalCommands.forEach(function (element: string) {
    console.log(element);
});

// Loop over the views
for(let view of Array.from( viewsMap.keys()) ) {
    let viewname = view.split('.');
    console.log(`\n### ${viewname[2].charAt(0).toUpperCase() + viewname[2].slice(1)}\n`);
    let commands = viewsMap.get(view);
    commands = sortStringArray(commands!);
    commands!.forEach((element) => {
        let elements: string[] = element.split('||'); 
        console.log(`* \`${elements[0]}\`: ${elements[1]}`);
    });
}

// Get configuration settings
let configItems = extensionData.contributes.configuration.properties;
let configElements = Object.keys(configItems);

console.log('\n## Extension Settings\n\n* `akkaserverless` - Parent for Akka Serverless-related extension settings');

configElements.forEach((element) => {
    console.log(`    * \`${element}\`: ${configItems[element]['description']}`);
});

function sortStringArray(arr: string[]): string[] {
    return arr.sort((n1,n2) => {
        if (n1 > n2) {
            return 1;
        }
    
        if (n1 < n2) {
            return -1;
        }
    
        return 0;
    });
}