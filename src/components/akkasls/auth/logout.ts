import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The logout command removes your Akka Serverless authorization token. Your Akka Serverless context is deleted and reset to 'default'.
 *
 * @export
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function logout(gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls auth logout');

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}