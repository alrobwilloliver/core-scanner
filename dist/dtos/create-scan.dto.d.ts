import { PayloadCommon } from "./payload.dto";
export declare class CreateScanDto {
    status: string;
}
export declare class PayloadDto {
    tests?: string[];
    scan_url: string;
    priority?: number;
    level?: string;
    user_agent?: string;
}
export declare class CreateScanRequestDto extends PayloadCommon<PayloadDto> {
    payload: PayloadDto;
}
//# sourceMappingURL=create-scan.dto.d.ts.map