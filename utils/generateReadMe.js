var extensionData = require('../package.json');
// Create views map
var viewsMap = new Map();
var viewItems = extensionData.contributes.views.as;
viewItems.forEach(function (element) {
    viewsMap.set(element.id, []);
});
// Loop through commands and store them either in a views map or a general commands array
var commandItems = extensionData.contributes.commands;
var generalCommands = [];
commandItems.forEach(function (element) {
    if (element.hasOwnProperty('category')) {
        generalCommands.push("* `Akka Serverless: " + element.title + "` - " + element.description);
    }
    else {
        var view = element.command.split('.');
        var viewname = view[0] + "." + view[1] + "." + view[2];
        var commands = viewsMap.get(viewname);
        commands === null || commands === void 0 ? void 0 : commands.push(element.title + "||" + element.description);
        viewsMap.set(viewname, commands);
    }
});
generalCommands = sortStringArray(generalCommands);
console.log('### General commands\n');
generalCommands.forEach(function (element) {
    console.log(element);
});
// Loop over the views
for (var _i = 0, _a = Array.from(viewsMap.keys()); _i < _a.length; _i++) {
    var view = _a[_i];
    var viewname = view.split('.');
    console.log("\n### " + (viewname[2].charAt(0).toUpperCase() + viewname[2].slice(1)) + "\n");
    var commands = viewsMap.get(view);
    commands = sortStringArray(commands);
    commands.forEach(function (element) {
        var elements = element.split('||');
        console.log("* `" + elements[0] + "`: " + elements[1]);
    });
}
// Get configuration settings
var configItems = extensionData.contributes.configuration.properties;
var configElements = Object.keys(configItems);
console.log('\n## Extension Settings\n\n* `akkaserverless` - Parent for Akka Serverless-related extension settings');
configElements.forEach(function (element) {
    console.log("    * `" + element + "`: " + configItems[element]['description']);
});
function sortStringArray(arr) {
    return arr.sort(function (n1, n2) {
        if (n1 > n2) {
            return 1;
        }
        if (n1 < n2) {
            return -1;
        }
        return 0;
    });
}
