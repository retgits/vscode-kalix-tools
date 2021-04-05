# Visual Studio Code Akka Serverless Tools

An extension for developers building stateful serverless applications on [Akka Serverless](https://akkaserverless.com).

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

[Download the latest available release](https://github.com/lightbend-labs/vscode-akkasls-tools/releases)

### Dependencies

The Akka Serverless extension may need to invoke the following command line tools, depending on which features you use. You will need `akkasls` at minimum, and `docker` if you plan to use the extension to build applications rather than only browse.

## Commands and features

`vscode-akkasls-tools` supports a number of commands for interacting with Akka Serverless; these are accessible via the command menu (`Ctrl+Shift+P`) and may be bound to keys in the normal way.

### General commands

* `Log in`: Open the Akka Serverless Console to log in and authenticate the CLI
* `Open console`: Open the Akka Serverless Console in a browser window
* `Open docs`: Open the Akka Serverless documentation in a browser window
* `Open forum`: Open the Akka Serverless forum in a browser window
* `Open ideas portal`: Open the Akka Serverless ideas portal in a browser window
* `Open status page`: Open the Akka Serverless status page in a browser window
* `Generate new Javascript service (npx) - experimental`: Generate a new Javascript based service using npx
* `Generate new Javascript service (npm) - experimental`: Generate a new Javascript based service using npm
* `Generate new Java service (Maven) - experimental`: Generate a new Java based service using Maven

### Projects

* `Refresh`: Refresh the project explorer
* `Show details`: Show the details of the current selected item
* `Logs`: Show the logs of a service based on selected parameters
* `Create a new project`: Create a new project
* `Deploy service`: Deploy a new service
* `Delete service`: Delete an existing service
* `Expose service`: Expose an existing service to the Internet
* `Unexpose service`: Remove a hostname from a service
* `Add registry credentials`: Add new credentials for a container registry
* `Delete registry credentials`: Remove credentials for a container registry
* `Invite user`: Invite a new user to your project
* `Delete invitation`: Delete a previously sent invitation

### Accounts & Tokens

* `Refresh`: Refresh the account explorer
* `Show details`: Show the details of the authentication token
* `Revoke`: Revoke a selected authentication token
* `Create a new token`: Create a new authentication token

### Status

* `Refresh`: Refresh the status explorer
* `Get info`: Open the Akka Serverless status page in your browser

### Tools

* `Refresh`: Refresh the tools explorer
* `Get info`: Open the info page for a tool in a browser window

## Extension Settings

* `akkaserverless.dryrun`: Whether commands will be printed in the logs rather than execute them
* `akkaserverless.logOutput`: Whether the result of the akkasls command is shown in the logs
* `akkaserverless.configFile`: Location of the config file to use (default ~/.akkaserverless/config.yaml)
* `akkaserverless.context`: The context to use
* `akkaserverless.enableExperimentalFeatures`: Whether experimental features should be enabled

## Release notes

See the [change log](CHANGELOG.md).