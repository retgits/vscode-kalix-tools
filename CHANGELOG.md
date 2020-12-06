# Change Log

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