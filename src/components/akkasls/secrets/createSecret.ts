import { Command, GlobalFlags, LiteralSecret} from '../command';
import { ShellResult } from '../../shell/shell';

/**
 * The createSecret command creates a secret for the currently configured project.
 *
 * @export
 * @param {string} type the type of secret. Valid types are generic and tls-ca
 * @param {string} name the name for secret.
 * @param {string} literal adescription of the token
 * @param {string} projectID the ID of the project create a secret in
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function createSecret(type: string, name: string, literal: LiteralSecret, projectID: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('akkasls secrets create');
    command.addParameter({name: 'type', value: type, addNameToCommand: false});
    command.addParameter({name: 'name', value: name, addNameToCommand: false});
    command.addParameter({ name: 'project', value: projectID, addNameToCommand: true });

    if (Object.keys(literal).length > 0) {
        let envString = [];
        let vars = Object.entries(literal);
        for (let index = 0; index < vars.length; index++) {
            const element = vars[index];
            envString.push(`${element[0]}=${element[1]}`);
        }
        command.addParameter({ name: 'literal', value: envString.join(','), addNameToCommand: true });
    }

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}