/* eslint-disable @typescript-eslint/naming-convention */
export interface Quickstart {
    'base-url':  string;
    quickstarts: QuickstartElement[];
}

export interface QuickstartElement {
    id:       string;
    language: string;
    title:    string;
    url:      string;
    dir:      string;
}

export interface CurrentLogin {
    user: User;
    token: Token;
}

export interface Token {
    name: string;
    created_time: Time;
    expire_time: Time;
    token_type: number;
    scopes: number[];
    description?: string;
}

export interface Time {
    seconds: number;
}

export interface User {
    name: string;
    email: string;
    fullName: string;
    email_verified: boolean;
    billing_identifier: BillingIdentifier;
}

export interface BillingIdentifier {
    id?: string
    billing_type: string;
    payload: string;
}

export interface Project {
    name: string;
    friendly_name: string;
    description: string;
    Owner: Owner;
    hostnames: Hostname[];
    billing_identifier: BillingIdentifier;
    execution_cluster_name: string;
}

export interface Owner {
    UserOwner: UserOwner;
}

export interface UserOwner {
    id: string;
    friendly_name: string;
}

export interface Hostname {
    name: string;
    is_generated: boolean;
}

export interface RegistryCredential {
    name:     string;
    server:   string;
    email:    string;
    username: string;
}

export interface Invite {
    name:    string;
    role_id: string;
    email:   string;
    created: Time;
}

export interface Member {
    name:               string;
    user_name:          string;
    user_email:         string;
    user_full_name:     string;
    user_friendly_name: string;
}

export interface Service {
    kind?:       string;
    apiVersion?: string;
    metadata:   Metadata;
    spec?:       Spec;
    status?:     Status;
}

export interface Metadata {
    name:              string;
    namespace?:         string;
    selfLink?:          string;
    uid:               string;
    resourceVersion?:   string;
    generation?:        number;
    creationTimestamp?: Date;
    labels?:            Labels;
    managedFields?:     ManagedField[];
}

export interface Labels {
    'app.kubernetes.io/part-of': string;
}

export interface ManagedField {
    manager:    string;
    operation:  string;
    apiVersion: string;
    time:       Date;
    fieldsType: string;
    fieldsV1:   FieldsV1;
}

export interface FieldsV1 {
    'f:metadata'?: FMetadata;
    'f:spec':      FSpec;
    'f:status'?:   FStatus;
}

export interface FMetadata {
    'f:labels': FLabels;
}

export interface FLabels {
    '.':                           Resources;
    'f:app.kubernetes.io/part-of': Resources;
}

export interface Resources {
}

export interface FSpec {
    '.'?:             Resources;
    'f:replicas'?:    Resources;
    'f:storeConfig'?: FStoreConfig;
    'f:containers'?:  Resources;
}

export interface FStoreConfig {
    '.':               Resources;
    'f:statefulStore': FStatefulStore;
}

export interface FStatefulStore {
    '.':      Resources;
    'f:name': Resources;
}

export interface FStatus {
    '.'?:            Resources;
    'f:conditions'?: Resources;
    'f:replicas'?:   Resources;
    'f:selector'?:   Resources;
    'f:summary'?:    Resources;
}

export interface Spec {
    containers:  Container[];
    replicas:    number;
    storeConfig: StoreConfig;
}

export interface Container {
    name:      string;
    image:     string;
    resources: Resources;
}

export interface StoreConfig {
    statefulStore: StatefulStore;
}

export interface StatefulStore {
    name: string;
}

export interface Status {
    summary:    string;
    replicas:   number;
    selector:   string;
    conditions: Condition[];
}

export interface Condition {
    type:               string;
    status:             string;
    lastTransitionTime: Date;
    reason:             string;
    message:            string;
}

// Converts JSON strings to/from your types
export class Convert {
    public static toCurrentLogin(json: string): CurrentLogin {
        return JSON.parse(json);
    }

    public static currentLoginToJson(value: CurrentLogin): string {
        return JSON.stringify(value);
    }

    public static toTokenList(json: string): Token[] {
        return JSON.parse(json);
    }

    public static tokenListToJson(value: Token[]): string {
        return JSON.stringify(value);
    }

    public static toProject(json: string): Project[] {
        return JSON.parse(json);
    }

    public static toProjectDetails(json: string): Project {
        return JSON.parse(json);
    }

    public static projectToJson(value: Project[]): string {
        return JSON.stringify(value);
    }

    public static toRegistryCredential(json: string): RegistryCredential[] {
        return JSON.parse(json);
    }

    public static registryCredentialToJson(value: RegistryCredential[]): string {
        return JSON.stringify(value);
    }

    public static toInvite(json: string): Invite[] {
        return JSON.parse(json);
    }

    public static inviteToJson(value: Invite[]): string {
        return JSON.stringify(value);
    }

    public static toMember(json: string): Member[] {
        return JSON.parse(json);
    }

    public static memberToJson(value: Member[]): string {
        return JSON.stringify(value);
    }

    public static toService(json: string): Service[] {
        return JSON.parse(json);
    }

    public static toSingleService(json: string): Service {
        return JSON.parse(json);
    }

    public static serviceToJson(value: Service[]): string {
        return JSON.stringify(value);
    }
    
    public static toQuickstart(json: string): Quickstart {
        return JSON.parse(json);
    }

    public static quickstartToJson(value: Quickstart): string {
        return JSON.stringify(value);
    }
}