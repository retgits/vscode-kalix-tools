// Internal dependencies
import { config, commandConfig, Command, EnvVars, LogTypes } from './commands';
import { ShellResult } from '../../shell';

export interface Condition {
    type?: string;
    status?: string;
    lastTransitionTime?: Date;
    reason?: string;
    message?: string;
}

export interface Container {
    name?: string;
    image?: string;
}

export interface Metadata {
    name: string;
    namespace?: string;
    selfLink?: string;
    uid: string;
    resourceVersion?: string;
    generation?: number;
    creationTimestamp?: Date;
}

export interface Service {
    kind?: string;
    apiVersion?: string;
    metadata: Metadata;
    spec?: Spec;
    status?: Status;
}

export interface Spec {
    containers?: Container[];
    replicas?: number;
    storeConfig?: StoreConfig;
}

export interface StatefulStore {
    name?: string;
}

export interface Status {
    summary?: string;
    replicas?: number;
    selector?: string;
    conditions?: Condition[];
}

export interface StoreConfig {
    statefulStore?: StatefulStore;
}

/**
 * The deployService command deploys a service to your Akka Serverless project
 *
 * @param {string} service The name of the service to deploy
 * @param {string} image The container image to deploy
 * @param {string} projectID The ID of the project to deploy to
 * @param {EnvVars} { vars } The environment variables to use
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function deployService(service: string, image: string, projectID: string, ev: EnvVars, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.services.deployService);
    command.addParameter({ name: 'service', value: service, addNameToCommand: false });
    command.addParameter({ name: 'image', value: image, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

    if (ev.vars) {
        command.addParameter({ name: 'env', value: ev.vars.join(','), addNameToCommand: true });
    }

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
 * The exposeService command creates a route to expose a service for inbound traffic. You may optionally enable HTTP CORS with the `--enable-cors` flag
 *
 * @param {string} service The name of the service to expose
 * @param {string} flags The flags for the operation
 * @param {string} projectID The ID of the project to expose the service in
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function exposeService(service: string, flags: string, projectID: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.services.exposeService);
    command.addParameter({ name: 'service', value: service, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });
    command.addParameter({ name: 'flags', value: flags, addNameToCommand: false });

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
 * The listServices command lists all services in a project
 *
 * @param {string} projectID The ID of the project to list services for
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function listServices(projectID: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.services.listServices);
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

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
 * The deleteService command deletes a service from your Akka Serverless account
 *
 * @param {string} service The name of the service to delete
 * @param {string} projectID The ID of the project to delete the service from
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function deleteService(service: string, projectID: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.services.deleteService);
    command.addParameter({ name: 'service', value: service, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

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
 * The unexposeService removes a route from your service
 *
 * @param {string} service The name of the service to remove a route from
 * @param {string} hostname The name of the route to remove
 * @param {string} projectID The ID of the project in which the service resides
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function unexposeService(service: string, hostname: string, projectID: string, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.services.unexposeService);
    command.addParameter({ name: 'service', value: service, addNameToCommand: false });
    command.addParameter({ name: 'hostname', value: hostname, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

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
 * The getServiceLogs command get the last hour of logs of a specific service in the current project.
 * If none of the lifecycle, service, proxy or cloudstate flags are supplied, defaults to outputting service and lifecycle logs.
 *
 * @param {string} service The service to get logs for
 * @param {string} projectID The ID of the project in which the service resides
 * @param {LogTypes} {cloudstateLogs, lifecycleLogs, proxyLogs, serviceLogs, tail }
 * @param {CommandInput} { dryrun, silent, configFile, context }
 * @return {*}  {Promise<ShellResult>}
 */
export async function getServiceLogs(service: string, projectID: string, lt: LogTypes, cc: commandConfig): Promise<ShellResult | undefined> {
    // Create the command
    const command = new Command(config.services.getServiceLogs);
    command.addParameter({ name: 'service', value: service, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

    // Set flags
    if (lt.cloudstateLogs) {
        command.addParameter({ name: 'cloudstateLogs', value: '--cloudstate', addNameToCommand: false });
    }

    if (lt.lifecycleLogs) {
        command.addParameter({ name: 'lifecycleLogs', value: '--lifecycle', addNameToCommand: false });
    }

    if (lt.proxyLogs) {
        command.addParameter({ name: 'proxyLogs', value: '--proxy', addNameToCommand: false });
    }

    if (lt.serviceLogs) {
        command.addParameter({ name: 'serviceLogs', value: '--service', addNameToCommand: false });
    }

    if (lt.tail) {
        command.addParameter({ name: 'tail', value: `${lt.tail}`, addNameToCommand: true });
    }

    if (lt.follow) {
        command.addParameter({ name: 'follow', value: '--follow', addNameToCommand: false });
    }

    // Set parameters
    command.setSilent(cc.silent);
    command.setConfigFile(cc.configFile);
    command.setContext(cc.context);

    // Run the command
    if (cc.dryrun) {
        return command.dryRun();
    }

    if (lt.follow && lt.callback) {
        return command.stream(lt.callback);
    }

    return await command.run();
}