'use strict';

import { AkkaServerless } from '../../akkasls';
import { ProjectBaseTreeItem } from './projectBaseTreeItem';
import { Project } from '../../datatypes/projects/project';
import { TreeItemCollapsibleState, ThemeIcon} from 'vscode';
import { aslogger } from '../../utils/logger';
import * as table from 'cli-table3';

export const PROJECT_ITEM_TYPE = 'Projects';

export class ProjectTreeItem extends ProjectBaseTreeItem {
    constructor(
        public readonly label: string,
        public readonly project: Project,
        public readonly collapsibleState: TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, PROJECT_ITEM_TYPE);
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

    contextValue = PROJECT_ITEM_TYPE;

    iconPath = new ThemeIcon('project');

    printDetails() {
        if (this.label !== PROJECT_ITEM_TYPE) {
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
            aslogger.log(printTable.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
        }
    }
}

export async function GetProjectTreeItems(akkasls: AkkaServerless): Promise<ProjectTreeItem[]> {
    let projects: ProjectTreeItem[] = [];

    let projectList = await akkasls.getProjects();

    for (let project of projectList) {
        projects.push(new ProjectTreeItem(project.friendly_name, project, TreeItemCollapsibleState.Collapsed));
    }

    return projects;
}
