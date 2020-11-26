export interface CurrentLogin {
    user:  User;
    token: Token;
}

export interface Token {
    name:         string;
    created_time: Time;
    expire_time:  Time;
    token_type:   number;
    scopes:       number[];
}

export interface Time {
    seconds: number;
}

export interface User {
    name:           string;
    email:          string;
    fullName:       string;
    email_verified: boolean;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCurrentLogin(json: string): CurrentLogin {
        return JSON.parse(json);
    }

    public static currentLoginToJson(value: CurrentLogin): string {
        return JSON.stringify(value);
    }
}