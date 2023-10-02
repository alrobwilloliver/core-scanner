import * as fs from "fs";
import * as json5 from "json5";

import logger from "./logger";

export interface AuthConfig
{
    publicKeyPath: string;
    basicKeyPath: string;
}

export class Config
{
    public envName: string // The environment name this service is running as, ex: "local", "dev", "sit-*", "rc", "preprod", "production".
    public productName: string // The product name this service is running for, ex: "reciteme", "taskmanager", affects the configs loaded.

    public name!: string; // The name of this service.
    public title!: string; // The title of this service.
    public url!: string // The url that this service can be accessed on.
    public port!: number; // The port that this service should run on.
    public host!: string; // The host that this service should accept connections from (0.0.0.0 for any).

    public prisma!: {
        enabled: boolean;
    };

    public mongoose!: {
        enabled: boolean;
        root: string;
    };

    public bull!: {
        processorName: string;
        enabled: boolean;
        root: string;
        port: number;
    }

    public auth!: AuthConfig; // Auth server configuration.

    /**
     * Constructor
     */
    public constructor()
    {
        this.envName = process.env.ENV_NAME ?? "local";
        this.productName = process.env.PRODUCT_NAME ?? "example"
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
     */
    public read(path: string): void
    {
        logger.info("Loading config values from: " + path + "...");
        const dataBuffer: Buffer = fs.readFileSync(path);
        const configData: Record<string, any> = json5.parse(dataBuffer.toString());

        this.name = configData.name ?? this.name;
        this.title = configData.title ?? this.title;
        this.port = configData.port ?? this.port;
        this.host = configData.host ?? this.host;

        // Databases:
        this.prisma = {
            enabled: configData.prisma?.enabled ?? false,
        };
        this.mongoose = {
            enabled: configData.mongoose?.enabled ?? this.mongoose?.enabled ?? false,
            root: configData.mongoose?.root ?? this.mongoose?.root ?? "",
        };
        this.bull = {
            enabled: configData.bull?.enabled ?? this.bull?.enabled ?? false,
            root: configData.bull?.root ?? this.bull?.root ?? "redis",
            port: configData.bull?.port ?? this.bull?.port ?? 6379,
            processorName: configData.bull?.processorName ?? this.bull?.processorName ?? "axe"
        }
        

        // URL:
        if (configData.urls && configData.urls[this.envName]) {
            this.url = configData.urls[this.envName];
        } else if (configData.url) {
            this.url = configData.url.split("{{ENV_NAME}}").join(this.envName);
        }

        this.auth = {
            publicKeyPath: configData.auth?.publicKeyPath ?? "keys/public.pem",
            basicKeyPath: configData.auth?.basicKeyPath ?? "keys/basic.key",
        };
    }
}
