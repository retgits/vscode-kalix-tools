// Internal dependencies
import { config, commandConfig, Command } from './commands';
import { ShellResult } from '../../shell';

export interface Created {
    seconds: number;
}

export interface Invite {
    name:    string;
    // eslint-disable-next-line camelcase
    role_id: string;
    email:   string;
    created: Created;
}

export interface Member {
    name:               string;
    // eslint-disable-next-line camelcase
    user_name:          string;
    // eslint-disable-next-line camelcase
    user_email:         string;
    // eslint-disable-next-line camelcase
    user_full_name:     string;
    // eslint-disable-next-line camelcase
    user_friendly_name: string;
}

/**
 * The deleteInvite command deletes an invitation from a project
 *
 * @param {string} projectID The ID of the project to delete the invite from
 * @param {string} emailAddress The email address to the delete the invite for
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function deleteInvite(projectID: string, emailAddress: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.roles.deleteInvite);
    command.addParameter({name: 'emailAddress', value: emailAddress, addNameToCommand: false});
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
 * The addInvite command invites a user to a project
 *
 * @param {string} projectID The ID of the project to invite the user to
 * @param {string} emailAddress The email address of the user to invite
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function addInvite(projectID: string, emailAddress: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.roles.addInvite);
    command.addParameter({name: 'role', value: 'admin', addNameToCommand: true});
    command.addParameter({name: 'emailAddress', value: emailAddress, addNameToCommand: false});
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
 * The listInvites command lists all invitations to a project
 *
 * @param {string} projectID The ID of the project to list invites for
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function listInvites(projectID: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.roles.listInvites);
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

/**
 * The listMembers command lists all members to a project
 *
 * @param {string} projectID The ID of the project to list members for
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function listMembers(projectID: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.roles.listMembers);
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