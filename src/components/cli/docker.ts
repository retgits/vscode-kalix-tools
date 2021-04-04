// Internal dependencies
import { config, commandConfig, Command } from './commands';
import { ShellResult } from '../../shell';

export interface Credential {
    name:     string;
    server:   string;
    username: string;
}

/**
 * The addDockerCredentials command adds a set of docker credentials to the project.
 *
 * @param {string} projectID The ID of the project to use
 * @param {string} credentials The string containing credentials and server URL
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function addDockerCredentials(projectID: string, credentials: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.docker.addDockerCredentials);
    command.addParameter({name: 'credentials', value: credentials, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

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

/**
 * The deleteDockerCredentials command removes a set of Docker credentials from the project.
 *
 * @param {string} projectID The ID of the project to use
 * @param {string} credentialID The ID of the credential to remove
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function deleteDockerCredentials(projectID: string, credentialID: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.docker.deleteDockerCredentials);
    command.addParameter({name: 'credentialID', value: credentialID, addNameToCommand: false});
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

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

/**
 * The listDockerCredentials command lists all the Docker credentials set for the project. (passwords are not displayed)
 *
 * @param {string} projectID The ID of the project to use
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function listDockerCredentials(projectID: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command('akkasls docker list-credentials -o json');
    command.addParameter({name: 'project', value: projectID, addNameToCommand: true});

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