/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as path from 'path';
import { generateMavenJava, generateNpmJs, ShellResult } from '@retgits/akkasls-nodewrapper';
import { workspace, QuickPickItem, window } from 'vscode';
import { MultiStepInput } from './multiStepInput';
import { logger } from '../../utils/logger';

const WIZARD_TITLE = 'Generate New Akka Serverless Project';
const RUNTIMES = ["npm-js", "maven-java"];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function templateWizard(commandInput: any): Promise<void> {

	interface State {
		runtime: QuickPickItem | string;
		name: string;
		artifactID: string;
		groupID: string;
		packageName: string;
		version: string;
	}

	if(workspace.workspaceFolders === undefined) {
		window.showErrorMessage("Working folder not found, open a folder and try again");
		return;	
	}

	async function collectInputs() {
		const state = {} as Partial<State>;
		await MultiStepInput.run(input => pickMyRuntime(input, state));
		return state as State;
	}

	async function pickMyRuntime(input: MultiStepInput, state: Partial<State>) {
		const runtimes: QuickPickItem[] = RUNTIMES.map(label => ({ label }));
		const pick = await input.showQuickPick({
			title: WIZARD_TITLE,
			step: 1,
			totalSteps: 1,
			placeholder: 'Choose your language and build tool',
			items: runtimes,
			activeItem: typeof state.runtime !== 'string' ? state.runtime : undefined
		});
		state.runtime = pick;
		
		if (pick.label === "npm-js") {
			return (input: MultiStepInput) => inputName(input, state);
		}

		return (input: MultiStepInput) => inputArtifactID(input, state);
	}

	async function inputName(input: MultiStepInput, state: Partial<State>) {
		state.name = await input.showInputBox({
			title: WIZARD_TITLE,
			step: 2,
			totalSteps: 2,
			value: state.name || '',
			prompt: 'Choose the name to use for the new project'
		});
	}

	async function inputArtifactID(input: MultiStepInput, state: Partial<State>) {
		state.artifactID = await input.showInputBox({
			title: WIZARD_TITLE,
			step: 2,
			totalSteps: 5,
			value: state.artifactID || '',
			prompt: 'Choose the artifactId to use for the new project'
		});
		return (input: MultiStepInput) => inputGroupID(input, state);
	}

	async function inputGroupID(input: MultiStepInput, state: Partial<State>) {
		state.artifactID = await input.showInputBox({
			title: WIZARD_TITLE,
			step: 3,
			totalSteps: 5,
			value: state.artifactID || '',
			prompt: 'Choose the groupId to use for the new project'
		});
		return (input: MultiStepInput) => inputPackage(input, state);
	}

	async function inputPackage(input: MultiStepInput, state: Partial<State>) {
		state.artifactID = await input.showInputBox({
			title: WIZARD_TITLE,
			step: 4,
			totalSteps: 5,
			value: state.packageName || '',
			prompt: 'Choose the Java package to use for the new project'
		});
		return (input: MultiStepInput) => inputVersion(input, state);
	}

	async function inputVersion(input: MultiStepInput, state: Partial<State>) {
		state.artifactID = await input.showInputBox({
			title: WIZARD_TITLE,
			step: 4,
			totalSteps: 5,
			value: state.packageName || '',
			prompt: 'Choose the initial version to use for the new project'
		});
	}

	const state = await collectInputs();
	const location = workspace.workspaceFolders[0].uri.path ;

	if (typeof state.runtime !== "string") {
		let result: ShellResult;
		if (state.runtime.label === "npm-js") {
			result = await generateNpmJs(path.join(location, `${state.name}.zip`), state.name, commandInput);
		} else {
			result = await generateMavenJava(path.join(location, `${state.name}.zip`), state.artifactID, state.groupID, state.packageName, state.version, commandInput);
		}
		if (result.code !== 0) {
			window.showErrorMessage(result.stderr);
		}
		logger.log(result.stdout);
	}
}