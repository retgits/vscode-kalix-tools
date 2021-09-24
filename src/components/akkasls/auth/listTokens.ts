import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The listTokens command will display all currently authorized tokens for your account.
 *
 * @export
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function listTokens(gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls auth tokens list -o json');

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}