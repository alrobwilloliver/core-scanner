export interface AuthConfig {
    publicKeyPath: string;
    basicKeyPath: string;
}
export declare class Config {
    envName: string;
    productName: string;
    name: string;
    title: string;
    url: string;
    port: number;
    host: string;
    prisma: {
        enabled: boolean;
    };
    mongoose: {
        enabled: boolean;
        root: string;
    };
    bull: {
        processorName: string;
        enabled: boolean;
        root: string;
        port: number;
    };
    auth: AuthConfig;
    /**
     * Constructor
     */
    constructor();
    /**
     * Reads values from configs and updates any config values.
     * @param configPath The path to the core config file.
     */
    read(path: string): void;
}
//# sourceMappingURL=config.d.ts.map