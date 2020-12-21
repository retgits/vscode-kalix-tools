import { AkkaServerless } from '../../akkasls';
import { BaseProjectExplorerItem } from './baseProjectExplorerItem';
import { Project } from '@retgits/akkasls-nodewrapper';
import { TreeItemCollapsibleState, ThemeIcon} from 'vscode';
import { logger } from '../../utils/logger';
import * as table from 'cli-table3';

export const PROJECT_ITEM_TYPE = 'Projects';

export class ProjectItem extends BaseProjectExplorerItem {
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

    printDetails(): void {
        if (this.label !== PROJECT_ITEM_TYPE) {
            const printTable = new table({});
            printTable.push(['Name', this.project.friendly_name]);
            if (this.project.description) {
                printTable.push(['Description', this.project.description]);
            }
            printTable.push(['Status', this.getStatus()]);
            if (this.project.hostnames) {
                const names: string[] = [];
                for (const hostname of this.project.hostnames) {
                    names.push(hostname.name);
                }
                printTable.push(['Hostnames', names.join('\n')]);
            }
            logger.log(printTable.toString().replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, ''));
        }
    }
}

export async function getProjectItems(akkasls: AkkaServerless): Promise<ProjectItem[]> {
    const projects: ProjectItem[] = [];

    const projectList = await akkasls.listProjects();

    for (const project of projectList) {
        projects.push(new ProjectItem(project.friendly_name, project, TreeItemCollapsibleState.Collapsed));
    }

    return projects;
}
