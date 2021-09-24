import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The currentLogin command shows details for the currently logged in user. This includes name, email, and whether the user has been verified.
 *
 * @export
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function currentLogin(gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls auth current-login -o json');

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}