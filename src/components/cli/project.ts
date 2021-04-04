// Internal dependencies
import { config, commandConfig, Command } from './commands';
import { ShellResult } from '../../shell';

export interface Project {
    name:          string;
    // eslint-disable-next-line camelcase
    friendly_name: string;
    description?:  string;
    Owner:         Owner;
    status?:       number;
    hostnames?:    Hostname[];
}

export interface Owner {
    UserOwner: UserOwner;
}

export interface UserOwner {
    id: string;
}

export interface Hostname {
    name:         string;
    // eslint-disable-next-line camelcase
    is_generated: boolean;
}

/**
 * The listProjects command will list a one-line summary of all projects that your Akka Serverless account has access to.
 *
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function listProjects(cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.projects.listProjects);

    // Set parameters
    command.setSilent(cc.silent);
    command.setConfigFile(cc.configFile);
    command.setContext(cc.context);

    // Run the command
    if (cc.dryrun) {
        return command.dryRun();
    }

    const result = await command.run();

    if (result === undefined) {
        return undefined;
    }

    if (result.code === 0 ) {
        result.response = JSON.parse(result?.stdout);
    }
    return result;
}

/**
 * The newProject command will create a new project in your Akka Serverless account.
 *
 * @param {string} name The name for your new project
 * @param {string} description The description for your new project
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function newProject(name: string, description: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command('akkasls projects new');
    command.addParameter({name: 'name', value: name, addNameToCommand: false});
    command.addParameter({name: 'description', value: `"${description}"`, addNameToCommand: false});

    // Set parameters
    command.setSilent(cc.silent);
    command.setConfigFile(cc.configFile);
    command.setContext(cc.context);

    // Run the command
    if (cc.dryrun) {
        return command.dryRun();
    }

    return await command.run();
}