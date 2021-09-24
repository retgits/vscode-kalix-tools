import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The quickstart list command will list a one-line summary of all quickstart samples for Akka Serverless.
 *
 * @export
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function listQuickstarts(gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls quickstart list -o json');

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}