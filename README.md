# Visual Studio Code Akka Serverless Tools

An extension for developers building stateful serverless applications on [Akka Serverless](https://docs.cloudstate.com).

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

## Commands and features

`vscode-akkasls-tools` supports a number of commands for interacting with Akka Serverless; these are accessible via the command menu (`Ctrl+Shift+P`) and may be bound to keys in the normal way.

### General commands (part of the `Akka Serverless` category)

* Add Docker credentials to an Akka Serverless project
* Add new project
* Delete Docker credentials from an Akka Serverless project
* Delete invitation for user from project
* Deploy a service to Akka Serverless
* Expose a service for inbound traffic
* Invite user to project
* Login to Akka Serverless
* Logout from Akka Serverless
* Remove a service from Akka Serverless
* Removes a service route from a service
* Run current workspace as Akka Serverless function
* Stop current local running Akka Serverless function
* View Akka Serverless status page

### Projects

* Add credentials
* Delete credentials
* Delete invitation for user
* Deploy service
* Expose service
* Invite user
* Refresh
* Undeploy service
* Unexpose service
* View credential details
* View in browser
* View invite details
* View member details
* View project details
* View service details

### Credentials

* Refresh
* Revoke token
* View token details

### Status

* Get status info
* Refresh

### Tools

* Get tool info
* Refresh

## Extension Settings

* `akkaserverless` - Parent for Akka Serverless-related extension settings
    * `akkaserverless.dryrun`: DryRun prints the commands in the log and does not execute them
    * `akkaserverless.logOutput`: Log output from the Akka Serverless CLI

## Release notes

See the [change log](CHANGELOG.md).