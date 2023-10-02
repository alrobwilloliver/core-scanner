"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanProcessor = exports.PROCESSOR_NAME = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../logger"));
const browser_service_1 = require("../services/browser.service");
const analyser_factory_1 = require("../analyser/analyser-factory");
exports.PROCESSOR_NAME = process.env.PROCESSOR_NAME ?? "scan";
let ScanProcessor = class ScanProcessor {
    browserService;
    scanQueue;
    bullConfig;
    browserInstance;
    constructor(browserService, scanQueue, bullConfig) {
        this.browserService = browserService;
        this.scanQueue = scanQueue;
        this.bullConfig = bullConfig;
    }
    async handleScan(job) {
        const maxRetrys = 2;
        try {
            logger_1.default.debug(`Handling scan with id: ${job.id}...`);
            this.browserInstance = await this.browserService.createInstance({
                url: job.data.scanUrl,
                timeout: job.data.timeout,
                user_agent: job.data.user_agent,
            });
            job.data.issues = await (0, analyser_factory_1.createAnalyser)(exports.PROCESSOR_NAME, this.browserInstance.page, job.data.rules).analyse();
        }
        catch (err) {
            logger_1.default.warn(`Error scanning url: ${job.data.scanUrl} with error message: ${err.message}`);
            // throw the error to initiate a retry unless exceeding max retry (attempts starts from 0)
            if (job.data.attempts < maxRetrys) {
                job.data.failed = true;
                logger_1.default.debug(`Retrying scan for url: ${job.data.scanUrl} Attempt: ${job.data.attempts + 1}`);
                // must add a new scan to the list with priority 1 to retry instantly
                await this.scanQueue.add("scan-axe", {
                    scanUrl: job.data.scanUrl,
                    job_id: job.data.job_id,
                    authHeader: job.data.authHeader,
                    timeout: 30000,
                    rules: job.data.rules,
                    callback: job.data.callback,
                    level: job.data.level,
                    attempts: job.data.attempts + 1,
                    user_agent: job.data.user_agent
                }, {
                    priority: 1,
                    attempts: 1
                });
                if (this.browserInstance) {
                    await this.closePage(this.browserInstance?.browser);
                }
                return;
            }
        }
        if (!job.data.issues) {
            job.data.failed = true;
            logger_1.default.debug(`Failed to analyze scan results for scan with id: ${job.id}`);
            const config = {
                headers: { authorization: job.data.authHeader ?? "" },
            };
            axios_1.default.post(job.data.callback, {
                status: "failed",
                job_id: job.data.job_id,
                payload: {
                    scan_url: job.data.scanUrl,
                    status: "failed",
                    issues: []
                },
                error: {
                    message: "Failed to complete scan"
                }
            }, config).then(() => {
                logger_1.default.warn(`Sent message "failed" to scan url: ${job.data.scanUrl} relayed to ${job.data.callback}`);
            }).catch(() => {
                logger_1.default.error(`Failed to send error message "failure" status at url: ${job.data.callback} for scan url:${job.data.scanUrl} To url: ${job.data.callback}`);
            });
        }
        if (this.browserInstance) {
            await this.closePage(this.browserInstance?.browser);
        }
    }
    async onCompleted(job) {
        if (job.data.failed) {
            logger_1.default.warn(`Job Failed for scan url: ${job.data.scanUrl} and job id: ${job.id}`);
            return;
        }
        logger_1.default.info(`Completed scan job ${job.id} of type ${job.name} with ${job.data?.issues?.length} issues`);
        try {
            const config = {
                headers: { authorization: job.data.authHeader ?? "" },
            };
            logger_1.default.info(`Sending completed ${job.data.issues?.length} issues to be proccessed at callback url: ${job.data.callback} and at at scan url: ${job.data.scanUrl}`);
            await axios_1.default.post(job.data.callback, {
                status: "complete",
                job_id: job.data.job_id,
                payload: {
                    scan_url: job.data.scanUrl,
                    status: "complete",
                    issues: job.data.issues
                },
            }, config);
        }
        catch (err) {
            const config = {
                headers: { authorization: job.data.authHeader ?? "" },
            };
            logger_1.default.error(`Failed to send ${job.data.issues?.length} issues with a job id of ${job.id} to be proccessed for scan url: ${job.data.scanUrl} To url: ${job.data.callback}`);
            axios_1.default.post(job.data.callback, {
                status: "failed",
                job_id: job.data.job_id,
                payload: {
                    scan_url: job.data.scanUrl,
                    status: "failed",
                    issues: []
                },
                error: {
                    message: err.message
                }
            }, config).catch(() => {
                logger_1.default.error(`Failed to send error message "failure" status at url: ${job.data.callback} for scan url:${job.data.scanUrl} To url: ${job.data.callback}`);
            });
        }
    }
    onError(error) {
        logger_1.default.error(`Scan Job errored: ${error}`);
    }
    async closePage(browser) {
        await browser?.close();
    }
};
__decorate([
    (0, bull_1.Process)(exports.PROCESSOR_NAME),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScanProcessor.prototype, "handleScan", null);
__decorate([
    (0, bull_1.OnQueueCompleted)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ScanProcessor.prototype, "onCompleted", null);
__decorate([
    (0, bull_1.OnQueueError)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Error]),
    __metadata("design:returntype", void 0)
], ScanProcessor.prototype, "onError", null);
ScanProcessor = __decorate([
    (0, bull_1.Processor)(exports.PROCESSOR_NAME),
    __param(1, (0, bull_1.InjectQueue)(exports.PROCESSOR_NAME)),
    __param(2, (0, common_1.Inject)("BULL_CONFIG")),
    __metadata("design:paramtypes", [browser_service_1.BrowserService, Object, Object])
], ScanProcessor);
exports.ScanProcessor = ScanProcessor;
//# sourceMappingURL=scan.processor.js.map