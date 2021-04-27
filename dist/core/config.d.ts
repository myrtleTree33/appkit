export interface Config {
    appkitEnv: string;
    configPath: string;
    host: string;
    loggerRedactPaths: string[];
    nodeEnv: string;
    port: number;
}
export declare function getConfig(): Config;
declare const _default: Config;
export default _default;
