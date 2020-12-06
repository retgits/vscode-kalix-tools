import { expect } from 'chai';
import { AkkaServerlessProjectTemplate } from '../../akkasls/extensions/commands/parser';
import { join } from 'path';
import { before } from 'mocha';

suite('Akka Serverless :: Parser functions', () => {
    let template: AkkaServerlessProjectTemplate;

        before(() => {
            template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'template.valid.yaml'), 'docker.io/retgits');
            template.updateServiceConfiguration();
            template.updateContainerConfiguration();
        });

        test('Should be available for HelloWorld', () => {
            expect(template.isLocalFunctionAvailable('HelloWorld')).to.be.true;
        });
    
        test('Should not be available for Sunglasses', () => {
            expect(template.isLocalFunctionAvailable('Sunglasses')).to.be.false;
        });
});