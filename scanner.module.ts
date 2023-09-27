import { DynamicModule, Module, MiddlewareConsumer, NestModule } from "@nestjs/common";

import { ScannerCoreConfig } from "./scanner-core.config";

import { BrowserService } from "./services/browser.service";
import { ScanProcessor } from "./processor/scan.processor";

@Module({})
export class ScannerCoreModule implements NestModule
{
    public static register(config: ScannerCoreConfig): DynamicModule
    {
        return {
            module: ScannerCoreModule,
            providers: [
                {
                    provide: "CONFIG",
                    useValue: config,
                },
                {
                    provide: "BULL_CONFIG",
                    useValue: config.bull,
                },
                BrowserService,
                ScanProcessor,
            ],
            controllers: [],
            exports: [],
        };
    }

    public configure(consumer: MiddlewareConsumer) {}
}
