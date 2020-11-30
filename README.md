# Visual Studio Code Akka Serverless Tools

An extension for developers building stateful serverless applications on [Akka Serverless](https://docs.cloudstate.com).

![image](utils/image.png)

*[Illustration by Freepik Stories](https://stories.freepik.com/technology)*

Features include:

* View your projects in an explorer tree view, and drill into services, members, invites, and Docker credentials.
* Create new Akka Serverless projects.
* Deploy, undeploy, expose, and unexpose services.
* Invite users to your project or remove outstanding invites.
* Add and remove Docker credentials to your projects to work with private registries.
* Login to Akka Serverless.

**What's new in this version?**  See the [change log](CHANGELOG.md) to find out!

## Getting started with the extension

### Install

[Download the latest available release](https://github.com/retgits/vscode-akkasls-tools/releases)

### Dependencies

The Akka Serverless extension may need to invoke the following command line tools, depending on which features you use. You will need `akkasls` at minimum, and `docker` if you plan to use the extension to build applications rather than only browse.

### Configuration settings to run services locally

If you want to use the `Akka Serverless: Run local` and `Akka Serverless: Stop local` commands, you'll need to configure a user and repository for your container images. Under `Settings > Extension > Akka Serverless` you need to set `akkaserverless.dockerImageUser` to something like `docker.io/retgits`.

Other configuration details are read from a `.akkaserverless.yaml` file which must be in the same folder as your service. The `.akkaserverless.yaml` file has the following parameters:

```yaml
ASTemplateVersion: 1 ## The current template version
Resources:
    Docker:
        Dockerfile: ./dockerfile ## The name of the docker file to build your container
        Host: 127.0.0.1 ## The IP address of your local machine so the container and proxy can communicate. If you do not specify this, the extension will try to find it for you.
    Function:
        Name: shoppingcart ## The name of your service
        Version: '1.0.0' ## The version of your service
```

You can specify the location of the `.akkaserverless.yaml` file in a few different ways:

* Select the file through the VS Code context menu (right-click on a `.akkaserverless.yaml` file);
* Run the command while the current active text editor window in VS Code has the `.akkaserverless.yaml` file open;
* Have a `.akkaserverless.yaml` file in the current open workspace;
* Have a `.akkaserverless.yaml` file in the current open folder;
* If no file can be found, an error is displayed on your screen.

## Commands and features

`vscode-akkasls-tools` supports a number of commands for interacting with Akka Serverless; these are accessible via the command menu (`Ctrl+Shift+P`) and may be bound to keys in the normal way.

### General commands

* `Akka Serverless: Add credentials` - Add Docker registry credentials to an Akka Serverless project
* `Akka Serverless: Delete credentials` - Remove Docker registry credentials from an Akka Serverless project
* `Akka Serverless: Delete invite` - Removes the invitation of a user for a project
* `Akka Serverless: Deploy` - Deploy a service to Akka Serverless
* `Akka Serverless: Expose` - Expose a service for inbound traffic
* `Akka Serverless: Login` - Logs in to Akka Serverless by printing the login URL in the akkasls output window
* `Akka Serverless: Logout` - Logs out from Akka Serverless
* `Akka Serverless: New project` - Create a new project on Akka Serverless
* `Akka Serverless: Run local` - Runs a selected service and Cloudstate proxy on your machine to test your code (requires docker)
* `Akka Serverless: Send invite` - Invite a new user to a project on Akka Serverless
* `Akka Serverless: Stop local` - Stops the selected service and Cloudstate proxy
* `Akka Serverless: Undeploy` - Remove a service from Akka Serverless
* `Akka Serverless: Unexpose` - Removes a service route from a service
* `Akka Serverless: View Status` - Open the Akka Serverless status page in your browser

### Projects

* `Add credentials`: Add new Docker credentials to your project
* `Delete credentials`: Remove Docker credentials from your project
* `Delete invite`: Removes the invitation of a user
* `Deploy`: Deploy a service to Akka Serverless
* `Expose`: Expose a service for inbound traffic
* `Open in browser`: Opens the selected resource in the Akka Serverless Web UI
* `Refresh`: Refresh the project explorer view
* `Send invite`: Invite a new user to your project on Akka Serverless
* `Undeploy`: Remove a service from Akka Serverless
* `Unexpose`: Removes a service route from a service
* `View details`: Print the details of Docker credentials (doesn't log the password), project members, projects, services, or invites to the akkasls output window

### Credentials

* `Refresh`: Refresh the credentials explorer view
* `Revoke`: Revoke a token
* `View details`: Print the details of a token to the akkasls output window

### Status

* `Get info`: Open the Akka Serverless status page in your browser
* `Refresh`: Refresh the status explorer view

### Tools

* `Get info`: Open a webpage with detailed information about the selected tool
* `Refresh`: Refresh the tools explorer view

## Extension Settings

* `akkaserverless` - Parent for Akka Serverless-related extension settings
    * `akkaserverless.dryrun`: If true will print the commands in the log rather than execute them
    * `akkaserverless.logOutput`: If true will log output from the Akka Serverless CLI in the akkasls output window
    * `akkaserverless.dockerImageUser`: Image prefix for docker images ie 'docker.io/retgits'

## Release notes

See the [change log](CHANGELOG.md).