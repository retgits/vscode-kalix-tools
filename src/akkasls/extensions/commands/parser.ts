import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs-extra';
import { dirname, join } from 'path';
import * as datatypes from '../datatypes/astemplate';

export class AkkaServerlessProjectTemplate {
    private _template: datatypes.ASTemplate;
    private _services: datatypes.Service[] = [];
    private readonly _dockerImageUser: string;
    private _folderPath: string;

    constructor(file: string, dockerImageUser?: string) {
        this._template = <datatypes.ASTemplate>safeLoad(readFileSync(file, { encoding: 'utf-8' }));
        this._dockerImageUser = (dockerImageUser) ? dockerImageUser : '';
        this._folderPath = dirname(file);
    }

    validate(): boolean {
        let valid = this.isTemplateSupported();
        valid = this.isProjectNameValid();
        valid = this.isHostValid();
        return valid;
    }

    isTemplateSupported(): boolean {
        return this._template.ASTemplateVersion === datatypes.TEMPLATE_VERSION;
    }

    isProjectNameValid(): boolean {
        if (this._template.Globals) {
            return /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,62}$/.test(this._template.Globals.Project);
        }
        return false;
    }

    updateServiceConfiguration() {
        // TODO: Figure out a way to make this not use implicit any types 
        Object.keys(this._template.Resources).forEach((service) => {
            let svc = <datatypes.Service>this._template.Resources[service];

            if (!svc.Description && this._template.Globals && this._template.Globals.Description) {
                svc.Description = this._template.Globals.Description;
            }

            svc.Name = service;

            this._services.push(svc);
        });
    }

    getServices(): datatypes.Service[] {
        return this._services;
    }

    updateContainerConfiguration() {
        this._services.forEach((service) => {
            // A container must exist
            if (!service.Container) {
                throw new Error(`No container specified for this service ${service.Name}`);
            }

            // SkipBuild is an optional boolean. If it's not provided it's automatically set to false
            // If SkipBuild doesn't exist or is set to false, the BuildFile must be provided
            if (!service.Container.SkipBuild) {
                service.Container.SkipBuild = false;
                if (!service.Container.BuildFile) {
                    throw new Error('SkipBuild was set to false, but no BuildFile was specified');
                }
            }

            // If no image provided it'll be determined by <dockerImageUser>/<functionName>:<version>
            if (!service.Container.Image) {
                service.Container.Image = `${this._dockerImageUser}/${service.Name}:${service.Version}`;
            }

            if (!service.Container.BaseDir) {
                service.Container.BaseDir = join(this._folderPath, service.Name!);
            }
        });
    }

    isLocalFunctionAvailable(name: string): boolean {
        let found = this._services.find(service => {
            return service.Name === name;
        });
    
        if (!found) {
            return false;
        }

        return true;
    }

    isHostValid(): boolean {
        const ipRegExp: RegExp[] = [
            /^\s*((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))\s*$/, //ipv4
            /^\s*[\[]{0,1}\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*[\]]{0,1}\s*$/, //ipv6
            /^\s*([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*)([^a-z0-9-]|$)\s*/i // hostname RFC1123
        ];
    
        for (let regexp of ipRegExp) {
            if (this._template.Globals?.Local?.Host && regexp.test(this._template.Globals.Local.Host)) {
                return true;
            }
        }
    
        return false;
    }

    toString(): string {
        this._template.Resources = this._services;
        return JSON.stringify(this._template);
    }

    pushToRegistryCommands(): string[] {
        let commands: string[] = [];
        this._services.forEach((service) => {
            if (!service.Container?.SkipBuild) {
                commands.push(`docker push ${service.Container?.Image}`);
            }
        });
        return commands;
    }

    buildCommands(): string[] {
        let commands: string[] = [];
        this._services.forEach((service) => {
            if (!service.Container?.SkipBuild) {
                commands.push(`docker build . -f ${service.Container?.BuildFile} -t ${service.Container?.Image}`);
            }
        });
        return commands;
    }

    deployCommands(): string[] {
        let commands: string[] = [];
        this._services.forEach((service) => {
            commands.push(`akkasls deploy ${service.Name} ${service.Container?.Image} --project ${this._template.Globals?.Project}`);
        });
        return commands;
    }

    startLocalProxyCommands(): string[] {
        let commands: string[] = [];

        let localService = this._services.find((service) => {
            if(service.Name === this._template.Globals?.Local?.Function) {
                return service;
            }
            return undefined;
        });

        if(!localService) {
            throw new Error('Unable to find local function parameter in YAML file');
        }

        // build if needed
        if (!localService.Container?.SkipBuild) {
            commands.push(`${localService.Container?.BaseDir}||docker build . -f ${localService.Container?.BuildFile} -t ${localService.Container?.Image}`);
        }

        // Run the user function container
        commands.push(`${localService.Container?.BaseDir}||docker run -d --name ${localService.Name} -p 8080:8080 ${localService.Container?.Image}`);

        // Run the cloudstate proxy
        commands.push(`${localService.Container?.BaseDir}||docker run -d --name ${localService.Name}-proxy -p 9000:9000 --env USER_FUNCTION_HOST=${this._template.Globals?.Local?.Host} cloudstateio/cloudstate-proxy-dev-mode:latest`);

        return commands;
    }

    stopLocalProxyCommands(): string[] {
        let commands: string[] = [];

        let localService = this._services.find((service) => {
            if(service.Name === this._template.Globals?.Local?.Function) {
                return service;
            }
            return undefined;
        });

        if(!localService) {
            throw new Error('Unable to find local function parameter in YAML file');
        }

        commands.push(`docker stop ${localService.Name}`);
        commands.push(`docker stop ${localService.Name}-proxy`);
        commands.push(`docker rm ${localService.Name}`);
        commands.push(`docker rm ${localService.Name}-proxy`);

        return commands;
    }
}