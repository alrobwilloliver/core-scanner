"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const fs = __importStar(require("fs"));
const json5 = __importStar(require("json5"));
const logger_1 = __importDefault(require("./logger"));
class Config {
    envName; // The environment name this service is running as, ex: "local", "dev", "sit-*", "rc", "preprod", "production".
    productName; // The product name this service is running for, ex: "reciteme", "taskmanager", affects the configs loaded.
    name; // The name of this service.
    title; // The title of this service.
    url; // The url that this service can be accessed on.
    port; // The port that this service should run on.
    host; // The host that this service should accept connections from (0.0.0.0 for any).
    prisma;
    mongoose;
    bull;
    auth; // Auth server configuration.
    /**
     * Constructor
     */
    constructor() {
        this.envName = process.env.ENV_NAME ?? "local";
        this.productName = process.env.PRODUCT_NAME ?? "example";
        this.read(`configs/${this.productName}/default.json5`);
        const files = fs.readdirSync(`configs/${this.productName}`);
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
    read(path) {
        logger_1.default.info("Loading config values from: " + path + "...");
        const dataBuffer = fs.readFileSync(path);
        const configData = json5.parse(dataBuffer.toString());
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
        };
        // URL:
        if (configData.urls && configData.urls[this.envName]) {
            this.url = configData.urls[this.envName];
        }
        else if (configData.url) {
            this.url = configData.url.split("{{ENV_NAME}}").join(this.envName);
        }
        this.auth = {
            publicKeyPath: configData.auth?.publicKeyPath ?? "keys/public.pem",
            basicKeyPath: configData.auth?.basicKeyPath ?? "keys/basic.key",
        };
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map