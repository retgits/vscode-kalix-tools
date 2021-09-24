import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The createToken command allows you to create a refresh token that can be used to authenticate another akkasls command instance on another machine.
 *
 * @export
 * @param {string} type the type of token. Valid types are refresh and access
 * @param {string} scopes the scopes for the token. Valid scopes are: all, projects, user, execution
 * @param {string} description adescription of the token
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function createToken(type: string, scopes: string, description: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls auth tokens create');
    command.addParameter({name: 'type', value: type, addNameToCommand: true});
    command.addParameter({name: 'scopes', value: scopes, addNameToCommand: true});
    command.addParameter({name: 'description', value: `"${description}"`, addNameToCommand: true});

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}