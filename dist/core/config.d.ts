export interface Config {
    appkitEnv: string;
    configPath: string;
    entryRoot: string;
    host: string;
    loggerRedactPaths: string[];
    nodeEnv: string;
    port: number;
    routesPath: string;
}
export declare function getConfig(): Config;
