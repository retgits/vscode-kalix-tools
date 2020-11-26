export interface TokenList {
    name:         string;
    description:  string;
    created_time: Time;
    scopes:       number[];
    expire_time?: Time;
    token_type?:  number;
}

export interface Time {
    seconds: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toTokenList(json: string): TokenList[] {
        return JSON.parse(json);
    }

    public static tokenListToJson(value: TokenList[]): string {
        return JSON.stringify(value);
    }
}