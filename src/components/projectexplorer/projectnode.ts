import * as vscode from 'vscode';
import { PROJECT_ITEM_TYPE } from '../../utils/constants';
import { logger } from '../../utils/logger';
import { ProjectExplorerNode } from './projectexplorernode';
import { table } from 'table';
import { Convert, Project } from '../akkasls/api';
import { getConfiguration } from '../../utils/config';
import { listProjects } from '../akkasls/projects/listProjects';

/**
 * The ProjectNode is a node that captures the information of projects created by
 * users and acts as the parent node for all other nodes in this file
 *
 * @class ProjectNode
 * @extends {ProjectExplorerNode}
 */
export class ProjectNode extends ProjectExplorerNode {
    constructor(
        public readonly label: string,
        public readonly project: Project,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    ) {
        super(label, collapsibleState, PROJECT_ITEM_TYPE);
    }

    toString(): string {
        return this.label;
    }

    getName(): string {
        return this.project.name;
    }

    id = this.getName().substring(9);

    parentProjectID = this.id;

    contextValue = PROJECT_ITEM_TYPE;

    tooltip = this.project.execution_cluster_name;

    iconPath = new vscode.ThemeIcon('project');

    print(): void {
        if (this.label !== PROJECT_ITEM_TYPE) {
            const printTable = [];
            printTable.push(['Name', this.project.friendly_name]);
            if (this.project.description) {
                printTable.push(['Description', this.project.description]);
            }
            printTable.push(['Region', this.project.execution_cluster_name]);
            if (this.project.hostnames) {
                const names: string[] = [];
                for (const hostname of this.project.hostnames) {
                    names.push(hostname.name);
                }
                printTable.push(['Hostnames', names.join('\n')]);
            }
            logger.log(table(printTable), `Project details for: ${this.project.friendly_name}`);
        }
    }
}

/**
 * The getProjects retrieves all projects that the current user is part of
 *
 * @return {*}  {(Promise<ProjectNode[]>)}
 */
export async function getProjects(): Promise<ProjectNode[]> {
    const projects: ProjectNode[] = [];

    const result = await listProjects(getConfiguration());

    if (result.code !== undefined) {
        vscode.window.showErrorMessage(`Unable to obtain projects: ${result.stderr}`);
        return projects;
    }

    const projectList = Convert.toProject(result.stdout!);

    for (const project of projectList) {
        projects.push(new ProjectNode(project.friendly_name, project, vscode.TreeItemCollapsibleState.Collapsed));
    }

    return projects.sort();
}