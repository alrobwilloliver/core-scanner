import * as fs from "fs";
import * as json5 from "json5";
import { analyserType } from "analyser/analyser-factory";

export let PROCESSOR_NAME = "" as analyserType | string;

export type BullConfig = {
    processorName: analyserType | string; // Name of the bull processor.
    enabled: boolean; // True to enable bull for this app.
    root: string; // The root url of the redis database.
    port: number; // The port of the redis database.
};

export abstract class ScannerCoreConfig
{
    public readonly envName: string; // The environment name this service is running as, ex: "local", "dev", "sit-*", "rc", "preprod", "production".
    public readonly productName: string; // The product name this service is running for, ex: "reciteme", "taskmanager", affects the configs loaded.

    public name!: string; // The name of this service.
    public title!: string; // The title of this service.
    public url!: string; // The url that this service can be accessed on.
    public port!: number; // The port that this service should run on.
    public host!: string; // The host that this service should accept connections from (0.0.0.0 for any).

    public readonly bull: BullConfig = {
        processorName: "",
        enabled: false,
        root: "",
        port: 6379,
    };

    /**
     * Constructor
     */
    public constructor() {
        this.envName = process.env.ENV_NAME ?? "local";
        this.productName = process.env.PRODUCT_NAME ?? "WCAG Scanner Repository";
    }

    /**
     * Loads this config, should be called by child constructors or when reloading the config.
     */
    public load(): void {
        this.read(`configs/${this.productName}/default.json5`);
        const files: string[] = fs.readdirSync(`configs/${this.productName}`);
        files.filter(file => {
            if (file.startsWith("default.json")) {
                return false; // The default config is always loaded first.
            }
            return file.endsWith(".json") || file.endsWith(".json5");
        }).forEach(file => {
            this.read(`configs/${this.productName}/${file}`);
        });
    }

    /**
     * Reads values from configs and updates any config values.
     * @param configPath The path to the core config file.
     * @return The loaded config data.
     */
    public read(path: string): Record<string, any> {
        const dataBuffer: Buffer = fs.readFileSync(path);
        const configData: Record<string, any> = json5.parse(dataBuffer.toString());

        this.name = configData.name ?? this.name;
        this.title = configData.title ?? this.title;
        this.port = configData.port ?? this.port;
        this.host = configData.host ?? this.host;

        // URL:
        if (configData.urls && configData.urls[this.envName]) {
            this.url = configData.urls[this.envName];
        } else if (configData.url) {
            this.url = this.injectEnvs(configData.url);
        }

        // Queue (Scale Requests):        
        this.bull.enabled = configData.bull?.enabled ?? this.bull.enabled;
        this.bull.root = this.injectEnvs(configData.bull?.root) ?? this.bull.root;
        this.bull.port = configData.bull?.port ?? this.bull.port;
        this.bull.processorName = configData.bull?.processorName ?? this.bull.processorName;
        PROCESSOR_NAME = this.bull.processorName

        return configData;
    }

    /**
     * Injects env values into config values.
     * @param input The config value to inject into.
     * @return The injected config value.
     */
    protected injectEnvs(input: any): any {
        if (typeof input !== "string") {
            return input;
        }
        input = input.split("{{ENV_NAME}}").join(this.envName);
        input = input.split("{{PRODUCT_NAME}}").join(this.productName);
        return input.split("{{SERVICE_NAME}}").join(this.name);
    }
}
