'use strict';

import * as sls from '../../akkasls';
import * as base from './projectBaseTreeItem';
import * as project from '../../datatypes/projects/project';
import * as vscode from 'vscode';
import { aslogger } from '../../utils/logger';
import * as table from 'cli-table3';

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
        return this.project.name;
    }

    getStatus(): string {
        if (this.project.status === 1) {
            return 'pending';
        }
        return 'active';
    }

    id = this.getName().substring(9);

    tooltip = this.getStatus();

    contextValue = ITEM_TYPE;

    printDetails() {
        if (this.label !== ITEM_TYPE) {
            let printTable = new table({});
            printTable.push(['Name', this.project.friendly_name]);
            if (this.project.description) {
                printTable.push(['Description', this.project.description]);
            }
            printTable.push(['Status', this.getStatus()]);
            if (this.project.hostnames) {
                let names: string[] = [];
                for (let hostname of this.project.hostnames) {
                    names.push(hostname.name);
                }
                printTable.push(['Hostnames', names.join('\n')]);
            }
            aslogger.log(printTable.toString());
        }
    }
}

export async function getProjectTreeItems(akkasls: sls.AkkaServerless): Promise<ProjectTreeItem[]> {
    let projects: ProjectTreeItem[] = [];

    let projectList = await akkasls.getProjects();

    for (let project of projectList) {
        projects.push(new ProjectTreeItem(project.friendly_name, project, vscode.TreeItemCollapsibleState.Collapsed));
    }

    return projects;
}
