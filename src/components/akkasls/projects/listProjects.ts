import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * Get all projects for a specific Akka Serverless account
 *
 * @export
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function listProjects(gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls projects list -o json');

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}