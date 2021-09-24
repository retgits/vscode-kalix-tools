import { Command, GlobalFlags, LogTypes} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The getServiceLogs command get the last hour of logs of a specific service in the current project.
 * If none of the lifecycle, service, proxy or cloudstate flags are supplied, defaults to outputting service and lifecycle logs.
 *
 * @param {string} service The service to get logs for
 * @param {string} projectID The ID of the project in which the service resides
 * @param {LogTypes} lt
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function getServiceLogs(service: string, projectID: string, lt: LogTypes, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls services logs');
    command.addParameter({ name: 'service', value: service, addNameToCommand: false });
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

    if (lt.lifecycleLogs) {
        command.addParameter({ name: 'lifecycleLogs', value: '--lifecycle', addNameToCommand: false });
    }

    if (lt.instanceLogs) {
        command.addParameter({ name: 'instanceLogs', value: '--instance', addNameToCommand: false });
    }

    if (lt.tailLines) {
        command.addParameter({ name: 'tail', value: `${lt.tailLines}`, addNameToCommand: true });
    }

    if (lt.followLogs) {
        command.addParameter({ name: 'follow', value: '--follow', addNameToCommand: false });
    }

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    if (lt.followLogs && lt.callback) {
        return command.stream(lt.callback);
    }

    return command.run();
}