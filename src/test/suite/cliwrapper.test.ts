import { expect } from 'chai';
import { join } from 'path';
import { Command } from '../../utils/shell/command';
import { shell } from '../../utils/shell/shell';

suite('Akka Serverless :: CLI Wrapper', () => {
    test('Should store command', () => {
        let command = new Command('ls', shell);
        expect(command.command).to.eql('ls');
        expect(command.workingDir).to.be.undefined;
    });

    test('Should store command and working directory', () => {
        let command = new Command('ls', shell, process.cwd());
        expect(command.command).to.eql('ls');
        expect(command.workingDir).to.eql(process.cwd());
    });

    test('Should have no parameters to start', () => {
        let command = new Command('ls', shell, process.cwd());
        expect(command.toString()).to.eql('ls');
    });

    test('Should handle parameters with only a value', () => {
        let command = new Command('ls', shell, process.cwd());
        command.addParameter({ name: 'flags', value: '-alh', addNameToCommand: false });
        expect(command.toString()).to.eql('ls -alh');
    });

    test('Should handle parameters with name and value', () => {
        let command = new Command('ls', shell, process.cwd());
        command.addParameter({ name: 'file', value: 'spec.ts', addNameToCommand: true });
        expect(command.toString()).to.eql('ls --file spec.ts');
    });

    test('Should handle parameters with only a value', async () => {
        let command = new Command('ls', shell, join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates'));
        command.addParameter({ name: 'flags', value: '-alh', addNameToCommand: false });
        let result = await command.run();
        expect(result.code).to.eql(0);
        expect(result.stdout).to.contain('host.valid.yaml');
    });
});