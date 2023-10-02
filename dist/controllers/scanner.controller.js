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
exports.ScanController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const logger_1 = __importDefault(require("../logger"));
const create_scan_dto_1 = require("../dtos/create-scan.dto");
const bull_1 = require("@nestjs/bull");
const custom_http_exceptions_1 = require("../errors/custom-http-exceptions");
const member_guard_1 = require("../guards/member.guard");
const scan_processor_1 = require("../processor/scan.processor");
let ScanController = class ScanController {
    scanQueue;
    /**
     * Constructor
     * @param scanQue The injected scan queue.
     */
    constructor(scanQueue) {
        this.scanQueue = scanQueue;
    }
    /**
     * Parses a sitemap into json.
     * @param requestDto The sitemap dto to parse.
     * @return An accepted 202 response.
     */
    async create(scanInformation, authHeader) {
        try {
            await this.scanQueue.add(scan_processor_1.PROCESSOR_NAME, {
                scanUrl: scanInformation.payload.scan_url,
                job_id: scanInformation.job_id,
                timeout: 30000,
                rules: scanInformation.payload.tests,
                authHeader,
                callback: scanInformation.callback,
                attempts: 0,
                user_agent: scanInformation.payload.user_agent
            }, {
                priority: scanInformation.payload.priority ?? 3
            });
            return { status: "accepted" };
        }
        catch (err) {
            logger_1.default.debug(err);
            throw new custom_http_exceptions_1.LockedHttpException(`[${scan_processor_1.PROCESSOR_NAME} Scanner] Failed to add scan to queue`);
        }
    }
};
__decorate([
    (0, common_1.Post)("create"),
    (0, swagger_1.ApiExtraModels)(create_scan_dto_1.PayloadDto),
    (0, swagger_1.ApiBody)({ type: [create_scan_dto_1.CreateScanRequestDto] }),
    (0, swagger_1.ApiAcceptedResponse)(),
    (0, common_1.UseGuards)(member_guard_1.MemberGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)("Authorization")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_scan_dto_1.CreateScanRequestDto, String]),
    __metadata("design:returntype", Promise)
], ScanController.prototype, "create", null);
ScanController = __decorate([
    (0, common_1.Controller)({
        path: "scan",
    }),
    (0, swagger_1.ApiTags)("Scan"),
    __param(0, (0, bull_1.InjectQueue)(scan_processor_1.PROCESSOR_NAME)),
    __metadata("design:paramtypes", [Object])
], ScanController);
exports.ScanController = ScanController;
//# sourceMappingURL=scanner.controller.js.map