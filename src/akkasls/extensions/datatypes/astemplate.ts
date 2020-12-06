/* eslint-disable @typescript-eslint/naming-convention */
export const TEMPLATE_VERSION = '1.1.0';

export interface ASTemplate {
    ASTemplateVersion: string;
    Globals?: Globals;
    Resources: Object;
}

export interface Globals {
    Project: string;
    Description?: string;
    Local?: Local;
}

export interface Local {
    Host?: string;
    Function?: string;
}

export interface Service {
    Container?:   Container;
    Name?:        string;
    Version:     string;
    Description?: string;
}

export interface Container {
    BuildFile?: string;
    SkipBuild?: boolean;
    Image?:     string;
    BaseDir?:   string;
}