import { Controller, Post, Body, Headers, UseGuards, Inject } from "@nestjs/common";
import { ApiExtraModels, ApiBody, ApiTags, ApiAcceptedResponse } from "@nestjs/swagger";

import { Queue } from 'bull';
import logger from "../logger";

import { CreateScanRequestDto, PayloadDto, CreateScanDto } from "../dtos/create-scan.dto";
import { InjectQueue } from "@nestjs/bull";
import { LockedHttpException } from "../errors/custom-http-exceptions";
import { MemberGuard } from "../guards/member.guard";

import { PROCESSOR_NAME } from "../processor/scan.processor";

@Controller({
	path: "scan",
})
@ApiTags("Scan")
export class ScanController
{
    /**
	 * Constructor
	 * @param scanQue The injected scan queue.
	 */
	public constructor(
        @InjectQueue(PROCESSOR_NAME) private readonly scanQueue: Queue
    ) {}

    /**
     * Parses a sitemap into json.
     * @param requestDto The sitemap dto to parse.
     * @return An accepted 202 response.
     */
	@Post("create")
    @ApiExtraModels(PayloadDto)
    @ApiBody({ type: [CreateScanRequestDto] })
    @ApiAcceptedResponse()
    @UseGuards(MemberGuard)
    public async create(
        @Body() scanInformation: CreateScanRequestDto,
        @Headers("Authorization") authHeader?: string,
    ): Promise<CreateScanDto>
	{
        try {
            await this.scanQueue.add(PROCESSOR_NAME, { 
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
            return { status: "accepted" }
        } catch (err) {
            logger.debug(err);
            throw new LockedHttpException(`[${PROCESSOR_NAME} Scanner] Failed to add scan to queue`);
        }
	}
}
