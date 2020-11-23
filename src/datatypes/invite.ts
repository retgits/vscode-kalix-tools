export interface Invite {
    name:    string;
    role_id: string;
    email:   string;
    created: Created;
}

export interface Created {
    seconds: number;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toInviteArray(json: string): Invite[] {
        return JSON.parse(json);
    }

    public static invitesToJson(value: Invite[]): string {
        return JSON.stringify(value);
    }
}