import { Queue } from 'bull';
import { CreateScanRequestDto, CreateScanDto } from "../dtos/create-scan.dto";
export declare class ScanController {
    private readonly scanQueue;
    /**
     * Constructor
     * @param scanQue The injected scan queue.
     */
    constructor(scanQueue: Queue);
    /**
     * Parses a sitemap into json.
     * @param requestDto The sitemap dto to parse.
     * @return An accepted 202 response.
     */
    create(scanInformation: CreateScanRequestDto, authHeader?: string): Promise<CreateScanDto>;
}
//# sourceMappingURL=scanner.controller.d.ts.map