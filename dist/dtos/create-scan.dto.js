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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateScanRequestDto = exports.PayloadDto = exports.CreateScanDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const payload_dto_1 = require("./payload.dto");
class CreateScanDto {
    status;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: "Api status response"
    }),
    __metadata("design:type", String)
], CreateScanDto.prototype, "status", void 0);
exports.CreateScanDto = CreateScanDto;
class PayloadDto {
    tests;
    scan_url;
    priority;
    level;
    user_agent;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: "An array of test codes with which to run specific tests.",
        type: () => [String]
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], PayloadDto.prototype, "tests", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: "Url to be scanned"
    }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayloadDto.prototype, "scan_url", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: "number to make the scan a priority"
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PayloadDto.prototype, "priority", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: "Level to scan - not sure what this does"
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayloadDto.prototype, "level", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: "Custom user agent to use as header"
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PayloadDto.prototype, "user_agent", void 0);
exports.PayloadDto = PayloadDto;
class CreateScanRequestDto extends payload_dto_1.PayloadCommon {
    payload;
}
__decorate([
    (0, swagger_1.ApiProperty)({
        description: "A payload containing scan information.",
    }),
    (0, class_transformer_1.Type)(() => PayloadDto),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", PayloadDto)
], CreateScanRequestDto.prototype, "payload", void 0);
exports.CreateScanRequestDto = CreateScanRequestDto;
//# sourceMappingURL=create-scan.dto.js.map