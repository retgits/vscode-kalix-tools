// Internal dependencies
import { config, commandConfig, Command } from './commands';
import { ShellResult } from '../../shell';

export interface CurrentLogin {
    user: User;
    token: Token;
}

export interface Token {
    name: string;
    description?: string;
    // eslint-disable-next-line camelcase
    created_time: Time;
    scopes: number[];
    // eslint-disable-next-line camelcase
    expire_time?: Time;
    // eslint-disable-next-line camelcase
    token_type?: number;
}

export interface Time {
    seconds: number;
}

export interface User {
    name: string;
    email: string;
    fullName: string;
    // eslint-disable-next-line camelcase
    email_verified: boolean;
}

/**
 * The currentLogin command shows details for the currently logged in user. This includes name, email, and whether the user has been verified.
 *
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function currentLogin(cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.auth.currentLogin);

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
 * The listAuthTokens command will display all currently authorized tokens for your account.
 *
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function listAuthTokens(cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.auth.listAuthTokens);

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
 * The login command will run the login procedure.
 *
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function login(cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.auth.login);

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
 * The logout command removes your Akka Serverless authorization token. Your Akka Serverless context is deleted and reset to 'default'.
 *
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function logout(cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.auth.logout);

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
 * The revokeAuthToken command allows you to invalidate a specific authorization token.
 *
 * @param {string} tokenID the ID of the token to invalidate
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function revokeAuthToken(tokenID: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.auth.revokeAuthToken);
    command.addParameter({name: 'token', value: tokenID, addNameToCommand: false});

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
 * The createAuthToken command allows you to create a refresh token that can be used to authenticate another akkasls command instance on another machine.
 *
 * @param {string} type The type of token. Valid types are refresh and access.
 * @param {string} scopes The scopes for the token. The only valid scope is execution
 * @param {string} description A description of the token. This will be stored with the token for reference.
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function createAuthToken(type: string, scopes: string, description: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.auth.createAuthToken);
    command.addParameter({name: 'type', value: type, addNameToCommand: true});
    command.addParameter({name: 'scopes', value: scopes, addNameToCommand: true});
    command.addParameter({name: 'description', value: `"${description}"`, addNameToCommand: true});

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