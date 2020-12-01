'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { Disposable, OutputChannel, window } from 'vscode';

const AS_CHANNEL = 'akkasls';

/**
 * Interface Logger extends vscode.Disposable as a resource that can be deleted
 * and recycled.
 */
interface Logger extends Disposable {
    log(msg: string): void;
}

/**
 * ChannelLogger provides a log-like facility for sending messages to a shared output channel.
 */
class ChannelLogger implements Logger {
    channel: OutputChannel;

    constructor(channelName: string) {
        this.channel = window.createOutputChannel(channelName);
    }

    log(msg: string) {
        this.channel.append(msg);
        this.channel.append('\n');
        this.channel.show(true);
    }

    dispose() {
        this.channel.hide();
        this.channel.clear();
        this.channel.dispose();
    }
}

export const aslogger: Logger = new ChannelLogger(AS_CHANNEL);