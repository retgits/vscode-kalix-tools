export interface ListCredentials {
    name:     string;
    server:   string;
    username: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toListCredentials(json: string): ListCredentials[] {
        return JSON.parse(json);
    }

    public static listCredentialsToJson(value: ListCredentials[]): string {
        return JSON.stringify(value);
    }
}