import { copySync, emptyDirSync, ensureDirSync, existsSync, readdirSync } from 'fs-extra';
import { replaceInFileSync } from 'replace-in-file';
import { join } from 'path';
import { workspace, QuickPickItem, window } from 'vscode';
import { dirSync } from 'tmp';
import { shell } from '../utils/shell';
import { aslogger } from '../utils/logger';
import { MultiStepInput } from './multiStepInput';

const WIZARD_TITLE = 'Create Application Template';
const TOTAL_STEPS = 6;
const TEMPLATE_REPO_NAME = 'https://github.com/retgits/akkasls-templates';


export async function TemplateWizard() {
	const tempFolder = dirSync();

	const res = await shell.exec(`git clone --depth 1 ${TEMPLATE_REPO_NAME} ${tempFolder.name}`);
	if (workspace.getConfiguration('akkaserverless').get('logOutput')) {
		aslogger.log(res.stderr);
		aslogger.log(res.stdout);
	}

	interface State {
		runtime: QuickPickItem | string;
		template: QuickPickItem | string;
		protoPackage: string;
		functionName: string;
		functionVersion: string;
		location: string;
	}

	async function collectInputs() {
		const state = {} as Partial<State>;
		await MultiStepInput.run(input => pickMyRuntime(input, state));
		return state as State;
	}

	async function pickMyRuntime(input: MultiStepInput, state: Partial<State>) {
		const runtimes: QuickPickItem[] = getAvailableRuntimes().map(label => ({ label }));
		const pick = await input.showQuickPick({
			title: WIZARD_TITLE,
			step: 1,
			totalSteps: TOTAL_STEPS,
			placeholder: 'Choose your runtime',
			items: runtimes,
			activeItem: typeof state.runtime !== 'string' ? state.runtime : undefined
		});
		state.runtime = pick;
		return (input: MultiStepInput) => pickMyTemplate(input, state);
	}

	async function pickMyTemplate(input: MultiStepInput, state: Partial<State>) {
		const templates: QuickPickItem[] = getAvailableProjectTemplates(state.runtime!).map(label => ({ label }));
		const pick = await input.showQuickPick({
			title: WIZARD_TITLE,
			step: 2,
			totalSteps: TOTAL_STEPS,
			placeholder: 'Choose a project template',
			items: templates,
			activeItem: typeof state.template !== 'string' ? state.template : undefined
		});
		state.template = pick;
		return (input: MultiStepInput) => inputMyPackageName(input, state);
	}

	async function inputMyPackageName(input: MultiStepInput, state: Partial<State>) {
		state.protoPackage = await input.showInputBox({
			title: WIZARD_TITLE,
			step: 3,
			totalSteps: TOTAL_STEPS,
			value: state.protoPackage || '',
			prompt: 'Choose a name for your protobuf package',
			validate: validatePackagename
		});
		return (input: MultiStepInput) => inputMyFunctionName(input, state);
	}

	async function inputMyFunctionName(input: MultiStepInput, state: Partial<State>) {
		state.functionName = await input.showInputBox({
			title: WIZARD_TITLE,
			step: 4,
			totalSteps: TOTAL_STEPS,
			value: state.functionName || '',
			prompt: 'Choose a name for your function',
			validate: validateFunctionname
		});
		return (input: MultiStepInput) => inputMyFunctionVersion(input, state);
	}

	async function inputMyFunctionVersion(input: MultiStepInput, state: Partial<State>) {
		state.functionVersion = await input.showInputBox({
			title: WIZARD_TITLE,
			step: 5,
			totalSteps: TOTAL_STEPS,
			value: state.functionVersion || '',
			prompt: 'Choose a version number for your function',
			validate: validateFunctionVersion
		});
		return (input: MultiStepInput) => inputMyLocation(input, state);
	}

	async function inputMyLocation(input: MultiStepInput, state: Partial<State>) {
		state.location = await input.showInputBox({
			title: WIZARD_TITLE,
			step: 6,
			totalSteps: TOTAL_STEPS,
			value: state.location || '',
			prompt: 'Choose a location to store your code',
			validate: validateLocationExists
		});
	}

	async function validatePackagename(name: string) {
		const pass = name.match(/^([a-z][a-z\d_]*\.)*[a-z][a-z\d_]*$/i);
		await new Promise(resolve => setTimeout(resolve, 1000));
		return pass === null ? 'Not a correct package name (com.abc.def)' : undefined;
	}

	async function validateFunctionname(name: string) {
		const pass = name.match(/^[a-zA-Z]*$/i);
		await new Promise(resolve => setTimeout(resolve, 1000));
		return pass === null ? 'Not a correct function name ([a-zA-Z])' : undefined;
	}

	async function validateFunctionVersion(name: string) {
		const pass = name.match(/^(\d+\.)?(\d+\.)?(\d+)$/i);
		await new Promise(resolve => setTimeout(resolve, 1000));
		return pass === null ? 'Not a correct function name (x.y.z)' : undefined;
	}

	async function validateLocationExists(name: string) {
		await new Promise(resolve => setTimeout(resolve, 1000));
		return !existsSync(name) ? 'Path does not exist' : undefined;
	}

	function getAvailableRuntimes(): string[] {
		return readdirSync(tempFolder.name).slice(1);
	}

	function getAvailableProjectTemplates(runtime: QuickPickItem | string): string[] {
		if (typeof runtime !== "string") {
			return readdirSync(join(tempFolder.name, runtime.label));
		}
		return [];
	}

	const state = await collectInputs();
	window.showInformationMessage(`Creating new template in '${state.location}'`);

	if (typeof state.runtime !== "string" && typeof state.template !== "string") {
		state.location = join(state.location, state.functionName);
		ensureDirSync(state.location);
		copySync(join(tempFolder.name, state.runtime.label, state.template.label), state.location);
	}

	replaceInFileSync({
		files: [
			`${state.location}/**`,
			`${state.location}/.*`
		],
		from: /{{functionname}}/g,
		to: state.functionName
	});

	replaceInFileSync({
		files: [
			`${state.location}/**`,
			`${state.location}/.*`
		],
		from: /{{functionversion}}/g,
		to: state.functionVersion
	});

	replaceInFileSync({
		files: [
			`${state.location}/**`
		],
		from: /{{protopackage}}/g,
		to: state.protoPackage
	});

	// Clean up the temp folder
	emptyDirSync(tempFolder.name);
	tempFolder.removeCallback();
}