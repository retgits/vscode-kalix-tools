import { expect } from 'chai';
import { AkkaServerlessProjectTemplate } from '../../akkasls/extensions/commands/parser';
import { join } from 'path';

suite('Akka Serverless :: Parser functions', () => {
    test('Should return false for invalid version', () => {
        let template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'version.invalid.yaml'), 'docker.io/retgits');
        expect(template.isTemplateSupported()).to.be.false;
    });

    test('Should return true for valid version', () => {
        let template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'version.valid.yaml'), 'docker.io/retgits');
        expect(template.isTemplateSupported()).to.be.true;
    });

    test('Should be valid', () => {
        let template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'template.valid.yaml'), 'docker.io/retgits');
        expect(template.validate()).to.be.true;
    });

    test('Should generate a proper string', () => {
        let template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'version.valid.yaml'), 'docker.io/retgits');
        expect(template.toString()).to.eql('{"ASTemplateVersion":"1.1.0","Globals":{"Project":"acme-sunglasses","Description":"hello world","Local":{"Host":"127.0.0.1","Function":"HelloWorld"}},"Resources":[]}');
    });

    test('Should be valid for acme-sunglasses', () => {
        let template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'projectname.valid.yaml'), 'docker.io/retgits');
        expect(template.isProjectNameValid()).to.be.true;
    });

    test('Should not be valid for h4x0r$', () => {
        let template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'projectname.invalid.yaml'), 'docker.io/retgits');
        expect(template.isProjectNameValid()).to.be.false;
    });

    test('Should be valid for 127.0.0.1', () => {
        let template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'host.valid.yaml'), 'docker.io/retgits');
        expect(template.isHostValid()).to.be.true;
    });

    test('Should not be valid for #h4x0r$', () => {
        let template = new AkkaServerlessProjectTemplate(join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates', 'host.invalid.yaml'), 'docker.io/retgits');
        expect(template.isHostValid()).to.be.false;
    });
});