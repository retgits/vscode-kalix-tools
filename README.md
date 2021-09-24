# Akka Serverless Tools for VSCode

[![license](https://img.shields.io/github/license/lightbend-labs/vscode-akkasls-tools)](https://img.shields.io/github/license/lightbend-labs/vscode-akkasls-tools) ![GitHub package.json version](https://img.shields.io/github/package-json/v/lightbend-labs/vscode-akkasls-tools)

> Develop, deploy, and manage Akka Serverless apps

Manage the stateful serverless applications you build on [Akka Serverless](https://akkaserverless.com), without leaving your favorite IDE! With this VS Code extension you don't have to remember all the flags to deploy services, add docker credentials, remove that one hostname from your service because you can do it all through VS Code.

## Key features

### Insight into your projects

From the projects explorer you can see all the projects that you have access to and you can drill into services, members, and container registry credentials. You can find the ones you need to edit, you can add new ones, or even remove entries you no longer need with a few clicks rather than typing commands. Invite developers to your project? just click... Deploy a service to Akka Serverless? just click... Add a new HTTP route to your service? just click!

### Easier deployments

Through the extension you can deploy services to Akka Serverless, following the same type of wizard as in the [Akka Serverless Console](https://console.akkaserverless.com). From the same plugin, you can also get the logs of your service and tail them as you try out your service.

**What's new in this version?**  See the [change log](CHANGELOG.md) to find out!

## Getting started with the extension

### Install

Download the latest release from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=lightbend-labs.vscode-akkasls-tools)

### Dependencies

The Akka Serverless extension may need to invoke the following command line tools, depending on which features you use. You will need `akkasls` at minimum, and `docker` if you plan to use the extension to build applications rather than only browse.

## Commands and features

`vscode-akkasls-tools` supports a number of commands to interact with Akka Serverless; these are accessible via the command menu (`Ctrl+Shift+P`) and the views that are contributed by the extension.

### Projects

This view controls all your projects, services, invites and members, and container registries. It is your one-stop-shop to manage and control your projects

### Account

This view shows the account data for the user that is currently logged in

### Tokens

This view shows all tokens that are currently active for the user

### Status

This view shows tatus information on the Akka Serverless platform

### Tools

This view goves an overview of the tools needed to build and deploy apps for Akka Serverless

## Configuration

- `akkaserverless.dryrun`: Whether commands will be printed in the logs rather than execute them
- `akkaserverless.silent`: Whether commands executed should write to stdout
- `akkaserverless.configFile`: Location of the config file to use (default ~/.akkaserverless/config.yaml)
- `akkaserverless.context`: The context to use
- `akkaserverless.enableExperimentalFeatures`: Whether experimental features should be enabled

## Release notes

See the [change log](CHANGELOG.md).

## Contributing

We welcome all contributions! [Pull requests](https://github.com/lightbend-labs/vscode-akkasls-tools/pulls) are the preferred way to share your contributions. For major changes, please open [an issue](https://github.com/lightbend-labs/vscode-akkasls-tools/issues) first to discuss what you would like to change.

## Support

This project is provided on an as-is basis and is not covered by the Lightbend Support policy.

## License

See the [LICENSE](./LICENSE).
