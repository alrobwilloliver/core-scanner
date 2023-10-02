import { DynamicModule, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { Config } from "./config";
export declare class ScannerCoreModule implements NestModule {
    static register(config: Config): DynamicModule;
    configure(consumer: MiddlewareConsumer): void;
}
//# sourceMappingURL=scanner-core.module.d.ts.map