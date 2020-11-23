export interface Member {
    name:               string;
    user_name:          string;
    user_email:         string;
    user_full_name:     string;
    user_friendly_name: string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toMemberArray(json: string): Member[] {
        return JSON.parse(json);
    }

    public static membersToJson(value: Member[]): string {
        return JSON.stringify(value);
    }
}