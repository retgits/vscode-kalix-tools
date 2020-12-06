/* eslint-disable @typescript-eslint/naming-convention */
export interface Service {
    kind?: string;
    apiVersion?: string;
    metadata: Metadata;
    spec?: Spec;
    status?: Status;
}

export interface Metadata {
    name: string;
    namespace?: string;
    selfLink?: string;
    uid: string;
    resourceVersion?: string;
    generation?: number;
    creationTimestamp?: Date;
    labels?: Labels;
}

export interface Labels {
    "app.kubernetes.io/part-of"?: string;
}

export interface Spec {
    containers?: Container[];
    replicas?: number;
    storeConfig?: StoreConfig;
}

export interface Container {
    name?: string;
    image?: string;
    resources?: Resources;
}

export interface Resources {
}

export interface StoreConfig {
    statefulStore?: StatefulStore;
}

export interface StatefulStore {
    name?: string;
}

export interface Status {
    summary?: string;
    replicas?: number;
    selector?: string;
    conditions?: Condition[];
}

export interface Condition {
    type?: string;
    status?: string;
    lastTransitionTime?: Date;
    reason?: string;
    message?: string;
}