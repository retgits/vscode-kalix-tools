export interface Tool {
    name: string;
    versionCmd: string;
    currentVersion?: string;
    infoURL?: string;
    updateURL?: string;
}