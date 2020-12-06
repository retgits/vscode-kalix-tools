import { QuickPickItem, window, Disposable, QuickInput, QuickInputButtons } from 'vscode';

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

class InputFlowAction {
	static back = new InputFlowAction();
	static cancel = new InputFlowAction();
	static resume = new InputFlowAction();
}

export type InputStep = (input: MultiStepInput) => Thenable<InputStep | void>;

export class MultiStepInput {

	static async run<T>(start: InputStep) {
		const input = new MultiStepInput();
		return input._stepThrough(start);
	}

	private _current?: QuickInput;
	private _steps: InputStep[] = [];

	private async _stepThrough<T>(start: InputStep) {
		let step: InputStep | void = start;
		while (step) {
			this._steps.push(step);
			if (this._current) {
				this._current.enabled = false;
				this._current.busy = true;
			}
			try {
				step = await step(this);
			} catch (err) {
				if (err === InputFlowAction.back) {
					this._steps.pop();
					step = this._steps.pop();
				} else if (err === InputFlowAction.resume) {
					step = this._steps.pop();
				} else if (err === InputFlowAction.cancel) {
					step = undefined;
				} else {
					throw err;
				}
			}
		}
		if (this._current) {
			this._current.dispose();
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
					...(this._steps.length > 1 ? [QuickInputButtons.Back] : []),
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
				if (this._current) {
					this._current.dispose();
				}
				this._current = input;
				this._current.show();
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
					...(this._steps.length > 1 ? [QuickInputButtons.Back] : []),
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
				if (this._current) {
					this._current.dispose();
				}
				this._current = input;
				this._current.show();
			});
		} finally {
			disposables.forEach(d => d.dispose());
		}
	}
}