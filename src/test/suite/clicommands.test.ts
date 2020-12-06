import { expect } from 'chai';
import { listAuthTokens } from '../../akkasls/commands/auth/tokens/list';
import { revokeAuthToken } from '../../akkasls/commands/auth/tokens/revoke';
import { currentLogin } from '../../akkasls/commands/auth/currentlogin';
import { login } from '../../akkasls/commands/auth/login';
import { logout } from '../../akkasls/commands/auth/logout';
import { addDockerCredentials } from '../../akkasls/commands/docker/addcredentials';
import { deleteDockerCredentials } from '../../akkasls/commands/docker/deletecredentials';
import { listDockerCredentials } from '../../akkasls/commands/docker/listcredentials';
import { listProjects } from '../../akkasls/commands/projects/list';
import { newProject } from '../../akkasls/commands/projects/new';
import { deleteInvite } from '../../akkasls/commands/roles/invitations/delete';
import { addInvite } from '../../akkasls/commands/roles/invitations/inviteuser';
import { listInvites } from '../../akkasls/commands/roles/invitations/list';
import { listMembers } from '../../akkasls/commands/roles/listbindings';
import { deployService } from '../../akkasls/commands/services/deploy';
import { exposeService } from '../../akkasls/commands/services/expose';
import { listServices } from '../../akkasls/commands/services/list';
import { unexposeService } from '../../akkasls/commands/services/unexpose';
import { undeployService } from '../../akkasls/commands/services/undeploy';
import { fakeShell } from '../fakeshell';

suite('Akka Serverless :: CLI Commands', () => {
    test('Should list all server managed Akka Serverless tokens', async () => {
        let result = await listAuthTokens(fakeShell);
        expect(result).to.be.not.empty;
        expect(result.length).to.eql(2);
    });

    test('Should revoke a Akka Serverless token successfully', async () => {
        let result = await revokeAuthToken('success', fakeShell);
        expect(result.stdout).to.be.not.empty;
        expect(result.code).to.eql(0);
    });

    test('Should show an error when an Akka Serverless token does note xist', async () => {
        let result = await revokeAuthToken('failed', fakeShell);
        expect(result.stdout).to.be.not.empty;
        expect(result.code).to.eql(0);
    });

    test('Should get details for the current logged in user', async () => {
        let result = await currentLogin(fakeShell);
        expect(result).to.be.not.empty;
        expect(result.user.fullName).to.eql('Hello World');
    });

    test('Should log in', async () => {
        let result = await login(fakeShell);
        expect(result).to.be.not.empty;
        expect(result.code).to.eql(0);
        expect(result.stdout).to.contain('You are now logged in.');
    });

    test('Should log out', async () => {
        let result = await logout(fakeShell);
        expect(result).to.be.not.empty;
        expect(result.code).to.eql(0);
        expect(result.stdout).to.contain('Logged out.');
    });

    test('Should add credentials', async () => {
        let result = await addDockerCredentials('projectID', 'credentialstring', fakeShell);
        expect(result).to.be.not.empty;
        expect(result.code).to.eql(0);
        expect(result.stdout).to.contain('Created docker credentials with id credentialid');
    });

    test('Should delete credentials', async () => {
        let result = await deleteDockerCredentials('projectID', 'success', fakeShell);
        expect(result).to.be.not.empty;
        expect(result.code).to.eql(0);
        expect(result.stdout).to.contain('Docker credentials deleted.');
    });

    test('Should fail to delete non-existing credentials', async () => {
        let result = await deleteDockerCredentials('projectID', 'failed', fakeShell);
        expect(result).to.be.not.empty;
        expect(result.code).to.eql(0);
        expect(result.stdout).to.contain('Error: error deleting docker credentials: rpc error: code = InvalidArgument desc = Invalid docker credentials name');
    });

    test('Should list credentials', async () => {
        let result = await listDockerCredentials('projectID', fakeShell);
        expect(result).to.be.not.empty;
        expect(result[0].server).to.eql('my-docker-registry');
    });

    test('Should list projects', async () => {
        let result = await listProjects(fakeShell);
        expect(result).to.be.not.empty;
        expect(result[0].friendly_name).to.eql('acme-sunglasses');
    });

    test('Should create new project', async () => {
        let result = await newProject('my-app2', 'cool', fakeShell);
        expect(result).to.be.not.empty;
        expect(result.stdout).to.contain('Created project my-app2.');
    });

    test('Should delete invitations', async () => {
        let result = await deleteInvite('projectID', 'email@example.com', fakeShell);
        expect(result).to.be.not.empty;
        expect(result.stdout).to.contain('Deleted invitation.');
    });

    test('Should send invitations', async () => {
        let result = await addInvite('projectID', 'email@example.com', fakeShell);
        expect(result).to.be.not.empty;
        expect(result.stdout).to.contain('Invited user.');
    });

    test('Should list invitations', async () => {
        let result = await listInvites('projectID', fakeShell);
        expect(result).to.be.not.empty;
        expect(result[0].email).to.eql('email@example.com');
    });

    test('Should list members', async () => {
        let result = await listMembers('projectID', fakeShell);
        expect(result).to.be.not.empty;
        expect(result[0].user_email).to.eql('email@example.com');
    });

    test('Should deploy services', async () => {
        let result = await deployService('example', 'docker.io/example/example', 'projectID', fakeShell);
        expect(result).to.be.not.empty;
        expect(result.stdout).to.contain('Service \'example\' was successfully deployed.');
    });

    test('Should expose services', async () => {
        let result = await exposeService('example', '--enable-cors', 'projectID', fakeShell);
        expect(result).to.be.not.empty;
        expect(result.stdout).to.contain('Service \'example\' was successfully exposed at: empty-king-8939.us-east1.apps.cloudstate.com');
    });

    test('Should list services', async () => {
        let result = await listServices('projectID', fakeShell);
        expect(result).to.be.not.empty;
        expect(result[0].metadata.name).to.eql('servicename');
    });

    test('Should unexpose services', async () => {
        let result = await unexposeService('example', 'empty-king-8939.us-east1.apps.cloudstate.com', 'projectID', fakeShell);
        expect(result).to.be.not.empty;
        expect(result.stdout).to.contain('Successfully removed the route to the service \'empty-king-8939\'.');
    });

    test('Should undeploy services', async () => {
        let result = await undeployService('example', 'projectID', fakeShell);
        expect(result).to.be.not.empty;
        expect(result.stdout).to.contain('Service \'example\' has successfully been undeployed.');
    });
});