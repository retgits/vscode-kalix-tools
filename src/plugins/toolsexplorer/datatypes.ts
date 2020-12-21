export interface Tool {
    name: string;
    versionCmd: string;
    toolTip?: string;
    currentVersion?: string;
    infoURL?: string;
    updateURL?: string;
}