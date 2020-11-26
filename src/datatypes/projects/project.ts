export interface Project {
    name:          string;
    friendly_name: string;
    description?:  string;
    Owner:         Owner;
    status?:       number;
    hostnames?:    Hostname[];
}

export interface Owner {
    UserOwner: UserOwner;
}

export interface UserOwner {
    id: string;
}

export interface Hostname {
    name:         string;
    is_generated: boolean;
}

export class Convert {
    public static toProjectArray(json: string): Project[] {
        return JSON.parse(json);
    }

    public static projectsToJson(value: Project[]): string {
        return JSON.stringify(value);
    }
}