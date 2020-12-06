import { expect } from 'chai';
import { AkkaServerlessProjectTemplate } from '../../akkasls/extensions/commands/parser';
import { join } from 'path';
import { before } from 'mocha';

suite('Akka Serverless :: Parser Service Updates', () => {
    let template: AkkaServerlessProjectTemplate;

    before(() => {
        template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'template.valid.yaml'), 'docker.io/retgits');
    });

    test('Should have an empty service array to start', () => {
        expect(template.getServices()).to.be.empty;
    });

    test('Should have 4 services after updating', () => {
        template.updateServiceConfiguration();
        expect(template.getServices().length).to.eql(4);
    });

    test('Should update container configs correctly', () => {
        template.updateContainerConfiguration();
        expect(template.getServices()[2].Container?.Image).to.eql('docker.io/retgits/UserService:3.0.0');
    });
});