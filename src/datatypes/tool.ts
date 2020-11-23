export interface Tool {
    name: string;
    versionCmd: string;
    currentVersion?: string;
    infoURL?: string;
    updateURL?: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toToolArray(json: string): Tool[] {
        return JSON.parse(json);
    }

    public static toolsToJson(value: Tool[]): string {
        return JSON.stringify(value);
    }
}