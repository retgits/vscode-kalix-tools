/* eslint-disable @typescript-eslint/naming-convention */
import { networkInterfaces } from 'os';

export interface ASConfig {
    ASTemplateVersion: string;
    Resources: Resources;
    InternalConfig: InternalConfig;
}

export interface InternalConfig {
    BaseDir: string;
    DockerImageUser: string;
}

export interface Resources {
    Docker: Docker;
    Function: Function;
}

export interface Docker {
    Dockerfile: string;
    Host?: string;
}

export interface Function {
    Name: string;
    Version: string;
}

export function GetIPAddress(): string {
    let ni = networkInterfaces();

    for (let name of Object.keys(ni)) {
        for (let networkInterface of ni[name]) {
            if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
                return networkInterface.address;
            }
        }
    }

    throw new Error('Unable to obtain valid IP address');
}