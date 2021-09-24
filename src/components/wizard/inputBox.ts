import * as vscode from 'vscode';

/**
 * Configures the behavior of the input box.
 */
export interface InputBoxOptions {
    /**
     * A string that represents the title of the input box.
     *
     * @type {string}
     * @memberof InputBoxOptions
     */
    title: string

    /**
     * An optional text to display underneath the input box.
     *
     * @type {string}
     * @memberof InputBoxOptions
     */
    prompt?: string

    /**
     * Controls if a password input is shown. Password input hides the typed text.
     *
     * @type {boolean}
     * @memberof InputBoxOptions
     */
    password?: boolean

    /**
     * An optional string to show as placeholder in the input box to guide the user what to type
     *
     * @type {string}
     * @memberof InputBoxOptions
     */
    placeHolder?: string

    /**
     * An optional function that will be called to validate input and to give a hint to the user.
     *
     * @memberof InputBoxOptions
     */
    validator?: ((s: string) => undefined | string)
}

/**
 * Opens an input box to ask the user for input.
 *
 * @export
 * @param {InputBoxOptions} i Configures the behavior of the input box.
 * @return {*}  {(Promise<string | undefined>)}
 */
export async function showInputBox(i: InputBoxOptions): Promise<string | undefined> {
    return vscode.window.showInputBox({
        title: i.title,
        prompt: i.prompt,
        ignoreFocusOut: true,
        password: i.password,
        placeHolder: i.placeHolder,
        validateInput: i.validator
    });
}