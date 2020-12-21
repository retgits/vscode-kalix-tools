import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs-extra';
import { workspace } from 'vscode';
import { logger } from '../../utils/logger';
import * as datatypes from './serverlesstemplate';
import { Command } from '@retgits/akkasls-nodewrapper';

const DEFAULT_DOCKER_TAG = 'latest';

export class ASLocal {
    private _template: datatypes.ServerlessFramework;
    private _services: datatypes.Function[] = [];

    constructor(file: string) {
        this._template = <datatypes.ServerlessFramework>safeLoad(readFileSync(file, { encoding: 'utf-8' }));
        logger.log('Read serverless.yml file');

        this._template.provider.docker.imageUser = (this._template.provider.docker.imageUser) ? this._template.provider.docker.imageUser : workspace.getConfiguration('akkaserverless')!.get<string>('dockerImageUser')!;
        logger.log(`Set imageUser to ${this._template.provider.docker.imageUser}`);

        Object.keys(this._template.functions).forEach((service) => {
            const svc = <datatypes.Function>this._template.functions[service];
            svc.name = service;
            this._services.push(svc);
        });
    }

    getServices(): datatypes.Function[] {
        return this._services;
    }

    getService(name: string): datatypes.Function {
        const existing = this._services.find((service) => {
            if (service.name === name) {
                return service;
            }
        });

        if (existing) {
            return existing;
        }

        throw new Error(`Service ${name} does not exist in serverless configuration file`);
    }

    async startLocalProxy(name: string): Promise<void> {
        const f = this.getService(name);

        const tag = getDockerTag(f.tag);
        if (tag === DEFAULT_DOCKER_TAG) {
            logger.warn(`${f.name} does not have a tag. Adding ${tag} for now, but this might cause issues while deploying...`);
        }

        const commands = [
            `docker network create -d bridge akkasls-${f.name}`,
            `docker run -d --name ${f.name} --hostname userfunction --network akkasls-${f.name} ${this._template.provider.docker.imageUser}/${f.name}:${tag}`,
            `docker run -d --name ${f.name}-proxy --network akkasls-${f.name} -p ${f.proxyHostPort}:9000 --env USER_FUNCTION_HOST=userfunction cloudstateio/cloudstate-proxy-dev-mode:latest`
        ];

        for (let index = 0; index < commands.length; index++) {
            const command = new Command(commands[index]);
            command.setSilent(true);
            const result = await command.run();
            logger.log(result.stdout);
            if (result.stderr) {
                logger.log(result.stderr);
            }
        }
    }

    async stopLocalProxy(name: string): Promise<void> {
        const f = this.getService(name);

        const commands = [
            `docker stop ${f.name}`,
            `docker stop ${f.name}-proxy`,
            `docker rm ${f.name}`,
            `docker rm ${f.name}-proxy`,
            `docker network rm akkasls-${f.name}`
        ];

        for (let index = 0; index < commands.length; index++) {
            const command = new Command(commands[index]);
            command.setSilent(true);
            const result = await command.run();
            logger.log(result.stdout);
            if (result.stderr) {
                logger.log(result.stderr);
            }
        }
    }
}

function getDockerTag(tag = DEFAULT_DOCKER_TAG) {
    return tag;
}