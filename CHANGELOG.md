# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.1.0](https://github.com/retgits/vscode-akkasls-tools/compare/v0.0.11...v0.1.0) (2020-12-21)


### Features

* add current login details to configexplorer ([2ff2124](https://github.com/retgits/vscode-akkasls-tools/commit/2ff21240373aee8a80ab52a2b055d882daf6fe87))
* add function picker to local ([26cb316](https://github.com/retgits/vscode-akkasls-tools/commit/26cb31668d32a2a1b5800991a5ab76b795a9ec3c))


### Bug Fixes

* move code to plugins ([0130610](https://github.com/retgits/vscode-akkasls-tools/commit/01306100ca6d497c2e45230c25bab7a0cf25349c))
* moved ascii escape sequence to logger ([4ea097b](https://github.com/retgits/vscode-akkasls-tools/commit/4ea097b33c7dea758f7c07e86c01d2990ab1308f))
* replace commands with nodewrapper lib ([8415b0e](https://github.com/retgits/vscode-akkasls-tools/commit/8415b0ef2b699aa6cdd8c9bf38f5ce78512f3ebe))
* update docker image user for local usage ([9dc3dd1](https://github.com/retgits/vscode-akkasls-tools/commit/9dc3dd139c722755ca2886da39ff6b6b1ed9819a))
* update try catch logic ([ee54ddc](https://github.com/retgits/vscode-akkasls-tools/commit/ee54ddc385b61a5c98bed642a30b2b3e5805eb2d))

## Version 0.0.11

- Refactor to wrap Akka Serverless commands in a different way
- Added unit tests
- Made sure that input boxes didn't disappear after losing focus

## Version 0.0.10

- A new configuration option has been added to allow the user to override the config file and context
- The commands to run services locally had the `akkasls` prefix, this has been solved
- The docker image user is now passed into the template wizard to allow templates to use that option too

## Version 0.0.9

- Updated filtering logic for Quick Start templates
- Refactored logic to make it more reusable

## Version 0.0.8

- Added Quick Start templates

## Version 0.0.7

- Replaced inputdialogs with quick picks
- Reduced size of the installer

## Version 0.0.5

- Fixed printing ANSI escape sequences in 'view details' pages

## Version 0.0.4

- Updated and documented the preview of running a function locally

## Version 0.0.3

- Added CLI wrappers and data types for most commands of the Akka Serverless CLI
- Encapsulated CLI logic into `akkasls.ts` to have a single place where CLI commands are done
- Removed duplicate entries of commands
- Linted all source files
- Added login, logout, and delete invite capabilities
- Added preview of running a function locally

## Version 0.0.2

- Added capabilities to add new projects and invite users
- Automatically refreshes the project explorer after changes are made
- Right clicking on tools now gives the option to open a webbrowser for that tool

## Version 0.0.1

- Initial release