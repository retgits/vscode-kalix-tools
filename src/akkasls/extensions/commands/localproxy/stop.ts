import { Command } from '../../../../utils/shell/command';
import { AkkaServerlessProjectTemplate } from '../parser';
import { Shell } from '../../../../utils/shell/shell';
import { ShellResult } from '../../../../utils/shell/datatypes';

export async function stopLocalProxy(configfile: string, dockerImageUser: string, shell: Shell): Promise<ShellResult> {
    let asProjectTemplate = new AkkaServerlessProjectTemplate(configfile, dockerImageUser);

    let stdout: string = '', stderr: string = '', code = 0;

    asProjectTemplate.stopLocalProxyCommands().forEach(async (cmd) => {
            let command = new Command(cmd, shell);
            let result = await command.run();
            stdout += `${result.stdout}\n`;
            stderr += `${result.stderr}\n`;
            code += result.code;
        }
    );

    return new Promise<ShellResult>((resolve) => {
        resolve({ code: code, stdout: stdout, stderr: stderr });
    });
}