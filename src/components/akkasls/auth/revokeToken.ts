import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The revokeToken command allows you to invalidate a specific authorization token.
 *
 * @export
 * @param {string} tokenID the ID of the token to invalidate
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function revokeToken(tokenID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls auth tokens revoke');
    command.addParameter({name: 'token', value: tokenID, addNameToCommand: false});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}