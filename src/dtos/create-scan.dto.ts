import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Expose, Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, IsArray, ValidateNested } from "class-validator"
import { PayloadCommon } from "./payload.dto";

export class CreateScanDto {
    @Expose()
    @ApiProperty({
        description: "Api status response"
    })
    public status!: string;
}

export class PayloadDto {

    @Expose()
    @ApiPropertyOptional({
        description: "An array of test codes with which to run specific tests.",
        type: () => [String]
    })
    @IsArray()
    @IsOptional()
    public tests?: string[];

    @Expose()
    @ApiProperty({
        description: "Url to be scanned"
    })
    @IsString()
    public scan_url!: string;

    @Expose()
    @ApiProperty({
        description: "number to make the scan a priority"
    })
    @IsNumber()
    @IsOptional()
    public priority?: number;

    @Expose()
    @ApiProperty({
        description: "Level to scan - not sure what this does"
    })
    @IsString()
    @IsOptional()
    public level?: string;

    @Expose()
    @ApiProperty({
        description: "Custom user agent to use as header"
    })
    @IsString()
    @IsOptional()
    public user_agent?: string;
}

export class CreateScanRequestDto extends PayloadCommon<PayloadDto>
{
    @ApiProperty({
        description: "A payload containing scan information.",
    })
    @Type(() => PayloadDto)
    @ValidateNested()
    public payload!: PayloadDto;
}