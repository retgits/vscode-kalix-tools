/* eslint-disable @typescript-eslint/naming-convention */
import * as os from 'os';

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

// Converts JSON strings to/from your types
export class Convert {
    public static toASConfig(json: string): ASConfig {
        let config: ASConfig = JSON.parse(json);
        if (!config.Resources.Docker.Host) {
            config.Resources.Docker.Host = getIPAddress();
        }
        return config;
    }
}

function getIPAddress(): string {
    let networkInterfaces = os.networkInterfaces();

    for (let name of Object.keys(networkInterfaces)) {
        for (let networkInterface of networkInterfaces[name]) {
            if (networkInterface.family === 'IPv4' && !networkInterface.internal) {
                return networkInterface.address;
            }
        }
    }

    throw new Error('Unable to obtain valid IP address');
}