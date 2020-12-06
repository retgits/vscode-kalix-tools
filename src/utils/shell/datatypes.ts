export type Parameter = {
    name: string
    value: string
    addNameToCommand: boolean
};

export interface IParameter {
    name: string
    value: string
    addNameToCommand: boolean
};

export interface ShellResult {
    readonly code: number;
    readonly stdout: string;
    readonly stderr: string;
}