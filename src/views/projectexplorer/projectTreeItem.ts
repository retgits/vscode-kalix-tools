'use strict'

import * as sls from '../../akkasls';
import * as base from './baseTreeItem';
import * as project from '../../datatypes/projects/project';
import * as vscode from 'vscode';
import { aslogger } from '../../utils/logger';

const Table = require('cli-table');

export const ITEM_TYPE = 'Projects';

export class ProjectTreeItem extends base.TreeItem {
    constructor(
        public readonly label: string,
        public readonly project: project.Project,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, ITEM_TYPE);
    }

    getName(): string {
        return this.project.name
    }

    getStatus(): string {
        if (this.project.status == 1) {
            return 'pending'
        }
        return 'active'
    }

    id = this.getName().substring(9)

    tooltip = this.getStatus()

    contextValue = ITEM_TYPE

    printDetails() {
        if (this.label != ITEM_TYPE) {
            const table = new Table({})
            table.push(['Name',this.project.friendly_name])
            if(this.project.description) {
                table.push(['Description',this.project.description])
            }
            table.push(['Status',this.getStatus()])
            if (this.project.hostnames) {
                let name: string = ''
                for (let hostname of this.project.hostnames) {
                    name += `${hostname.name}\n`
                }
                table.push(['Hostnames',name])
            }
            aslogger.log(table.toString())
        }
    }
}

export async function Get(akkasls: sls.AkkaServerless): Promise<ProjectTreeItem[]> {
    let projects: ProjectTreeItem[] = []

    let projectList = await akkasls.getProjects()

    for (let project of projectList) {
        projects.push(new ProjectTreeItem(project.friendly_name, project, vscode.TreeItemCollapsibleState.Collapsed))
    }

    return projects;
}
