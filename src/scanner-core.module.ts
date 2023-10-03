import { DynamicModule, Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";

import { Config } from "./config";

import { BrowserService } from "./services/browser.service";
import { PROCESSOR_NAME, ScanProcessor } from "./processor/scan.processor";
import { ScanController } from "./controllers/scanner.controller";

@Module({})
export class ScannerCoreModule implements NestModule
{
    public static register(config: Config): DynamicModule
    {
        return {
            module: ScannerCoreModule,
            imports: [
                BullModule.registerQueue(
                    {
                        name: config.bull.processorName,
                        settings: {
                            maxStalledCount: 0,
                        }
                    },
                ),
            ],
            providers: [
                ScanProcessor,
                {
                    provide: "CONFIG",
                    useValue: config,
                },
                {
                    provide: "BULL_CONFIG",
                    useValue: config.bull,
                },
                BrowserService,
            ],
            controllers: PROCESSOR_NAME === "assets" ? [] : [ScanController],
            exports: [],
        };
    }

    public configure(consumer: MiddlewareConsumer) {}
}
