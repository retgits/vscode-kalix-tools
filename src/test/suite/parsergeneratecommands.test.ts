import { expect } from 'chai';
import { AkkaServerlessProjectTemplate } from '../../akkasls/extensions/commands/parser';
import { join } from 'path';
import { before } from 'mocha';

suite('Akka Serverless :: Parser Generate Commands', () => {
    let template: AkkaServerlessProjectTemplate;

    before(() => {
        template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'template.valid.yaml'), 'docker.io/retgits');
        template.updateServiceConfiguration();
        template.updateContainerConfiguration();
    });

    test('Should have 3 docker push commands', () => {
        let cmds = template.pushToRegistryCommands();
        expect(cmds.length).to.eql(3);
    });

    test('Should have 3 docker build commands', () => {
        let cmds = template.buildCommands();
        expect(cmds.length).to.eql(3);
    });

    test('Should have 4 akkasls service deploy commands', () => {
        let cmds = template.deployCommands();
        expect(cmds.length).to.eql(4);
    });
});