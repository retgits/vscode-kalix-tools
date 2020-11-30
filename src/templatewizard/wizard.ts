import { copySync, emptyDirSync, ensureDirSync, existsSync, readdirSync } from 'fs-extra';
import * as rif from 'replace-in-file';
import { join } from 'path';
import { workspace, QuickPickItem, window, Disposable, QuickInput, QuickInputButtons } from 'vscode';
import * as tmp from 'tmp';
import  * as shell from '../utils/shell';
import { aslogger } from '../utils/logger';

export async function templateWizard() {
	const wizardTitle = 'Create Application Template';
    const totalSteps = 6;
    const templateRepoName = 'https://github.com/retgits/akkasls-templates';

	const tempFolder = tmp.dirSync();

	const res = await shell.shell.exec(`git clone --depth 1 ${templateRepoName} ${tempFolder.name}`);
    if (workspace.getConfiguration('akkaserverless').get('logOutput')) {
        aslogger.log(res.stderr);
        aslogger.log(res.stdout);
    }

	interface State {
		runtime:  QuickPickItem | string;
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
			title: wizardTitle,
			step: 1,
			totalSteps: totalSteps,
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
			title: wizardTitle,
			step: 2,
			totalSteps: totalSteps,
			placeholder: 'Choose a project template',
			items: templates,
			activeItem: typeof state.template !== 'string' ? state.template : undefined
		});
		state.template = pick;
		return (input: MultiStepInput) => inputMyPackageName(input, state);
	}

	async function inputMyPackageName(input: MultiStepInput, state: Partial<State>) {
		state.protoPackage = await input.showInputBox({
			title: wizardTitle,
			step: 3,
			totalSteps: totalSteps,
			value: state.protoPackage || '',
			prompt: 'Choose a name for your protobuf package',
			validate: validatePackagename
		});
		return (input: MultiStepInput) => inputMyFunctionName(input, state);
	}

	async function inputMyFunctionName(input: MultiStepInput, state: Partial<State>) {
		state.functionName = await input.showInputBox({
			title: wizardTitle,
			step: 4,
			totalSteps: totalSteps,
			value: state.functionName || '',
			prompt: 'Choose a name for your function',
			validate: validateFunctionname
		});
		return (input: MultiStepInput) => inputMyFunctionVersion(input, state);
	}

	async function inputMyFunctionVersion(input: MultiStepInput, state: Partial<State>) {
		state.functionVersion = await input.showInputBox({
			title: wizardTitle,
			step: 5,
			totalSteps: totalSteps,
			value: state.functionVersion || '',
			prompt: 'Choose a version number for your function',
			validate: validateFunctionVersion
		});
		return (input: MultiStepInput) => inputMyLocation(input, state);
	}

	async function inputMyLocation(input: MultiStepInput, state: Partial<State>) {
		state.location = await input.showInputBox({
			title: wizardTitle,
			step: 6,
			totalSteps: totalSteps,
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

	function getAvailableProjectTemplates(runtime: QuickPickItem|string): string[] {
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

	rif.replaceInFileSync({
		files: [
			`${state.location}/**`,
			`${state.location}/.*`
		],
		from: /{{functionname}}/g,
		to: state.functionName
	});

	rif.replaceInFileSync({
		files: [
			`${state.location}/**`,
			`${state.location}/.*`
		],
		from: /{{functionversion}}/g,
		to: state.functionVersion
	});

	rif.replaceInFileSync({
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


// -------------------------------------------------------
// Helper code that wraps the API for the multi-step case.
// -------------------------------------------------------


class InputFlowAction {
	static back = new InputFlowAction();
	static cancel = new InputFlowAction();
	static resume = new InputFlowAction();
}

type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

interface QuickPickParameters<T extends QuickPickItem> {
	title: string;
	step: number;
	totalSteps: number;
	items: T[];
	activeItem?: T;
	placeholder: string;
}

interface InputBoxParameters {
	title: string;
	step: number;
	totalSteps: number;
	value: string;
	prompt: string;
	validate: (value: string) => Promise<string | undefined>;
}

class MultiStepInput {

	static async run<T>(start: InputStep) {
		const input = new MultiStepInput();
		return input.stepThrough(start);
	}

	private current?: QuickInput;
	private steps: InputStep[] = [];

	private async stepThrough<T>(start: InputStep) {
		let step: InputStep | void = start;
		while (step) {
			this.steps.push(step);
			if (this.current) {
				this.current.enabled = false;
				this.current.busy = true;
			}
			try {
				step = await step(this);
			} catch (err) {
				if (err === InputFlowAction.back) {
					this.steps.pop();
					step = this.steps.pop();
				} else if (err === InputFlowAction.resume) {
					step = this.steps.pop();
				} else if (err === InputFlowAction.cancel) {
					step = undefined;
				} else {
					throw err;
				}
			}
		}
		if (this.current) {
			this.current.dispose();
		}
	}

	async showQuickPick<T extends QuickPickItem, P extends QuickPickParameters<T>>({ title, step, totalSteps, items, activeItem, placeholder }: P) {
		const disposables: Disposable[] = [];
		try {
			return await new Promise<T | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = window.createQuickPick<T>();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.placeholder = placeholder;
				input.items = items;
				if (activeItem) {
					input.activeItems = [activeItem];
				}
				input.buttons = [
					...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
				];
				disposables.push(
					input.onDidTriggerButton(item => {
						if (item === QuickInputButtons.Back) {
							reject(InputFlowAction.back);
						} else {
							resolve(<any>item);
						}
					}),
					input.onDidChangeSelection(items => resolve(items[0]))
				);
				if (this.current) {
					this.current.dispose();
				}
				this.current = input;
				this.current.show();
			});
		} finally {
			disposables.forEach(d => d.dispose());
		}
	}

	async showInputBox<P extends InputBoxParameters>({ title, step, totalSteps, value, prompt, validate }: P) {
		const disposables: Disposable[] = [];
		try {
			return await new Promise<string | (P extends { buttons: (infer I)[] } ? I : never)>((resolve, reject) => {
				const input = window.createInputBox();
				input.title = title;
				input.step = step;
				input.totalSteps = totalSteps;
				input.value = value || '';
				input.prompt = prompt;
				input.buttons = [
					...(this.steps.length > 1 ? [QuickInputButtons.Back] : []),
				];
				let validating = validate('');
				disposables.push(
					input.onDidTriggerButton(item => {
						if (item === QuickInputButtons.Back) {
							reject(InputFlowAction.back);
						} else {
							resolve(<any>item);
						}
					}),
					input.onDidAccept(async () => {
						const value = input.value;
						input.enabled = false;
						input.busy = true;
						if (!(await validate(value))) {
							resolve(value);
						}
						input.enabled = true;
						input.busy = false;
					}),
					input.onDidChangeValue(async text => {
						const current = validate(text);
						validating = current;
						const validationMessage = await current;
						if (current === validating) {
							input.validationMessage = validationMessage;
						}
					})
				);
				if (this.current) {
					this.current.dispose();
				}
				this.current = input;
				this.current.show();
			});
		} finally {
			disposables.forEach(d => d.dispose());
		}
	}
}
