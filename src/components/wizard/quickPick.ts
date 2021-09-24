import * as vscode from 'vscode';

/**
 * Configures the behavior of the selection list.
 *
 * @export
 * @interface QuickPickOptions
 */
export interface QuickPickOptions {
    /**
     * A string that represents the title of the quickpick menu.
     *
     * @type {string}
     * @memberof QuickPickOptions
     */
    title: string

    /**
     * An array of strings that are the items to be shown.
     *
     * @type {string[]}
     * @memberof QuickPickOptions
     */
    items: string[]

    /**
     * An optional string to show as placeholder in the input box to guide the user what to pick
     *
     * @type {string}
     * @memberof QuickPickOptions
     */
    placeHolder?: string
}

/**
 * Shows a selection list allowing multiple selections.
 *
 * @export
 * @param {QuickPickOptions} q
 * @return {*}  {(Promise<string[] | undefined>)}
 */
export async function showMultiQuickPick(q: QuickPickOptions): Promise<string[] | undefined> {
    return vscode.window.showQuickPick(q.items, {
		canPickMany: true,
        ignoreFocusOut: true,
        title: q.title,
        placeHolder: q.placeHolder,
        matchOnDetail: true
	});
}

/**
 * Shows a selection list allowing single item selections.
 *
 * @export
 * @param {QuickPickOptions} q
 * @return {*}  {(Promise<string[] | undefined>)}
 */
export async function showSingleQuickPick(q: QuickPickOptions): Promise<string | undefined> {
    return vscode.window.showQuickPick(q.items, {
		canPickMany: false,
        ignoreFocusOut: true,
        title: q.title,
        placeHolder: q.placeHolder,
        matchOnDetail: true
	});
}