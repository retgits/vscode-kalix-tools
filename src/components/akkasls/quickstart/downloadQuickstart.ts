import { Command, GlobalFlags} from '../command';
import { ShellResult } from '../../shell/shell';
import { logger } from '../../../utils/logger';

/**
 * The quickstart download command will download the quickstart into the provided directory
 *
 * @export
 * @param {string} qs the quickstart to download
 * @param {string} dir the directory to extract the quickstart to
 * @param {GlobalFlags} gf
 * @return {*}  {Promise<ShellResult>}
 */
export async function downloadQuickstart(qs: string, dir: string, gf: GlobalFlags): Promise<ShellResult> {
    const command = new Command('yes | akkasls quickstart download');
    command.addParameter({name: 'qs', value: qs, addNameToCommand: false});
    command.addParameter({name: 'output-dir', value: `"${dir}"`, addNameToCommand: true});

    logger.log(await (await command.dryRun()).stdout!);

    command.setSilent(gf.silent);
    command.setConfigFile(gf.configFile);
    command.setContext(gf.context);

    if (gf.dryrun) {
        return command.dryRun();
    }

    return command.run();
}