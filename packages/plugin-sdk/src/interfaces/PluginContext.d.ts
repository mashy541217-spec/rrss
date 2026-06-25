export interface PluginContext {
    readonly logger: {
        info(msg: string, ...args: any[]): void;
        warn(msg: string, ...args: any[]): void;
        error(msg: string, error?: Error, ...args: any[]): void;
    };
    readonly environment: Record<string, string>;
    readonly services: {
        get(name: string): any;
    };
}
