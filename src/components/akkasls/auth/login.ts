import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The login command will run the login procedure.
 *
 * @export
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function login(gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls auth login');

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}