export interface GetProject {
    ID:                string;
    OwnerID:           string;
    FriendlyName:      string;
    OwnerFriendlyName: string;
    OwnerType:         string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toGetProject(json: string): GetProject {
        return JSON.parse(json);
    }

    public static getProjectToJson(value: GetProject): string {
        return JSON.stringify(value);
    }
}