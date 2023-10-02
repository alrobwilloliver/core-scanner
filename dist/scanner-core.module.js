"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ScannerCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScannerCoreModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const browser_service_1 = require("./services/browser.service");
const scan_processor_1 = require("./processor/scan.processor");
const scanner_controller_1 = require("./controllers/scanner.controller");
let ScannerCoreModule = ScannerCoreModule_1 = class ScannerCoreModule {
    static register(config) {
        return {
            module: ScannerCoreModule_1,
            imports: [
                bull_1.BullModule.registerQueue({
                    name: config.bull.processorName,
                    settings: {
                        maxStalledCount: 0,
                    }
                }),
            ],
            providers: [
                scan_processor_1.ScanProcessor,
                {
                    provide: "CONFIG",
                    useValue: config,
                },
                {
                    provide: "BULL_CONFIG",
                    useValue: config.bull,
                },
                browser_service_1.BrowserService,
            ],
            controllers: [
                scanner_controller_1.ScanController
            ],
            exports: [],
        };
    }
    configure(consumer) { }
};
ScannerCoreModule = ScannerCoreModule_1 = __decorate([
    (0, common_1.Module)({})
], ScannerCoreModule);
exports.ScannerCoreModule = ScannerCoreModule;
//# sourceMappingURL=scanner-core.module.js.map