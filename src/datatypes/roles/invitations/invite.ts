export interface Invite {
    name:    string;
    role_id: string;
    email:   string;
    created: Created;
}

export interface Created {
    seconds: number;
}