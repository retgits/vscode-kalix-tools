# Visual Studio Code Akka Serverless Tools

An extension for developers building stateful serverless applications on [Akka Serverless](https://docs.cloudstate.com).

Features include:

* View your projects, services, members, and invites
* Deploy and undeploy services
* Expose and unexpose services
* Create new projects
* Invite users to your project

**What's new in this version?**  See the [change log](CHANGELOG.md) to find out!

## Getting started with the extension

### Install

[Download the latest available release](https://github.com/retgits/vscode-akkasls-tools/releases)

### Dependencies

The Akka Serverless extension may need to invoke the following command line tools, depending on which features you use. You will need `akkasls` at minimum, and `docker` if you plan to use the extension to build applications rather than only browse.

## Commands and features

`vscode-akkasls-tools` supports a number of commands for interacting with Akka Serverless; these are accessible via the command menu (`Ctrl+Shift+P`) and may be bound to keys in the normal way.

### Services

* `Akka Serverless: Deploy a service to Akka Serverless` - Deploys a new service and asks which project to deploy to
* `Akka Serverless: Expose a service for inbound traffic` - Exposes a service to the internet
* `Akka Serverless: Remove a service from Akka Serverless` - Undeploys an existing service
* `Akka Serverless: Removes a service route from a service` - Removes a route from a service

## Extension Settings
* `akkaserverless` - Parent for Akka Serverless-related extension settings
    * `akkaserverless.dryrun` - DryRun prints the commands in the log and does not execute them

## Release notes

See the [change log](CHANGELOG.md).