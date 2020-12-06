import { expect } from 'chai';
import { test } from 'mocha';
import { join } from 'path';
import { shell } from '../../utils/shell/shell';

suite('Akka Serverless :: Shell', () => {
    test('Should return true for echo', () => {
        expect(shell.existsInPath('echo')).to.be.true;
    });

    test('Should return false for foobar', () => {
        expect(shell.existsInPath('foobar')).to.be.false;
    });

    test('Should work for echo', async () => {
        let result = await shell.exec('echo helloworld');
        expect(result.code).to.eql(0);
        expect(result.stdout).to.eql('helloworld\n');
    });

    test('Should not work for foobar', async () => {
        let result = await shell.exec('foobar');
        expect(result.code).to.eql(127);
        expect(result.stderr).to.contain('foobar: command not found');
    });

    test('Should work for ls with a working dir', async () => {
        let result = await shell.exec('ls -alh', join(__dirname, '..', '..', '..', '..', 'src', 'test', 'testtemplates'));
        expect(result.code).to.eql(0);
        expect(result.stdout).to.contain('host.valid.yaml');
    });
});