'use strict'

import * as vscode from 'vscode';
import { aslogger } from '../utils/logger';
import  * as shell from '../utils/shell';

export type flag = {
    name: string
    description: string
    required?: boolean
    defaultValue?: string
    show?: boolean
}

interface flagParameters {
    name: string
    description: string
    required?: boolean
    defaultValue?: string
    show?: boolean
}

export type argument = {
    name: string
    description: string
    defaultValue?: string
    show?: boolean
}

interface argumentParameters {
    name: string
    description: string
    defaultValue?: string
    show?: boolean
}

export class Command {
    public readonly cmd: string
    private args: Array<argument>
    private flags: Array<flag>

    constructor(cmd: string, args?: Array<argument>, flags?: Array<flag>) {
        this.cmd = cmd;
        this.args = (args) ? args : [];
        this.flags = (flags) ? flags : [];
    }

    addArgument({ name, description, defaultValue, show = true }: argumentParameters) {
        this.args.push({
            name: name,
            description: description,
            defaultValue: defaultValue,
            show: show
        })
    }

    addFlag({ name, description, defaultValue, required = true, show = true }: flagParameters) {
        this.flags.push({
            name: name,
            description: description,
            required: required,
            defaultValue: defaultValue,
            show: show
        })
    }

    async runCommand(): Promise<shell.ShellResult | null> {
        let params: string[] = [this.cmd]

        for (let index = 0; index < this.args.length; index++) {
            const element = this.args[index];

            if (element.show) {
                let param = await vscode.window.showInputBox({
                    prompt: `${element.name}: ${element.description}`,
                    ignoreFocusOut: true,
                    value: element.defaultValue
                })
    
                if (param?.includes(" ")) {
                    param = `"${param}"`
                }
    
                let p: string = ''
                p += ` ${param}`
    
                params.push(p)
            } else {
                params.push(`  ${element.defaultValue}`)
            }
        }

        for (let index = 0; index < this.flags.length; index++) {
            const element = this.flags[index];

            if (element.show) {
                let param = await vscode.window.showInputBox({
                    prompt: `${element.name}: ${element.description}`,
                    ignoreFocusOut: true,
                    value: element.defaultValue
                })
    
                if (param?.includes(" ")) {
                    param = `"${param}"`
                }
    
                let p: string = ''
                p += ` --${element.name} ${param}`
    
    
                params.push(p)
    
                if (!param && element.required) {
                    let message: string = `Cannot complete ${this.cmd}, the parameter ${element.name} needs a value`
                    vscode.window.showErrorMessage(message)
                    return null
                }
            } else {
                params.push(` --${element.name} ${element.defaultValue}`)
            }
        }

        let tool: string = 'akkasls'

        if (vscode.workspace.getConfiguration('akkaserverless').get('dryrun')) {
            aslogger.log(`${tool} ${params.join('')}`)
            return null
        }

        let res = await shell.shell.exec(`${tool} ${params.join('')}`)

        if (vscode.workspace.getConfiguration('akkaserverless').get('logOutput')) {
            aslogger.log(res.stderr)
            aslogger.log(res.stdout)
        }

        return res
    }
}