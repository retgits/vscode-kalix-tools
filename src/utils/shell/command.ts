import * as datatypes from './datatypes';
import { Shell } from './shell';

export class Command {
    public readonly command: string;
    public readonly workingDir?: string;
    private _parameters: datatypes.Parameter[] = [];
    private _shell: Shell;

    constructor(command: string, shell: Shell, workingDir?: string) {
        this.command = command;
        this.workingDir = workingDir;
        this._shell = shell;
    };

    addParameter({ name, value, addNameToCommand }: datatypes.IParameter) {
        this._parameters.push({
            name: name,
            value: value,
            addNameToCommand: addNameToCommand
        });
    };

    toString(): string {
        let str = this.command;

        this._parameters.forEach((cmd) => {
            if (cmd.addNameToCommand) {
                // eslint-disable-next-line @typescript-eslint/semi
                str += ` --${cmd.name}`
            }
            str += ` ${cmd.value}`;
        });

        return str;
    }

    run(): Promise<datatypes.ShellResult> {
        return this._shell.exec(this.toString(), this.workingDir);
    }
}