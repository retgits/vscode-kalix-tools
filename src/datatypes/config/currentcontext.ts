export interface CurrentContext {
    Name:   string;
    Values: Object;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCurrentContext(json: string): CurrentContext {
        return JSON.parse(json);
    }

    public static currentContextToJson(value: CurrentContext): string {
        return JSON.stringify(value);
    }
}