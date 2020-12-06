import { Disposable, OutputChannel, window } from 'vscode';

interface Logger extends Disposable {
    log(msg: string): void;
}

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

export const aslogger: Logger = new ChannelLogger('akkasls');