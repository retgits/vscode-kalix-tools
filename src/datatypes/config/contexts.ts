export class Convert {
    public static toContexts(json: string): string[] {
        return JSON.parse(json);
    }

    public static contextsToJson(value: string[]): string {
        return JSON.stringify(value);
    }
}