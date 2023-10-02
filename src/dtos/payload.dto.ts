import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { Expose } from "class-transformer"
import { IsNotEmpty, IsOptional, IsString } from "class-validator"

export abstract class PayloadCommon<DtoType>
{
    @Expose()
    @ApiProperty({
        description: "The url to send job statuses to."
    })
    @IsNotEmpty()
    @IsString()
    public callback!: string

    @Expose()
    @ApiProperty({
        description: "The job id."
    })
    @IsNotEmpty()
    @IsString()
    public job_id!: string

    @Expose()
    @ApiPropertyOptional({
        description: "The user id."
    })
    @IsOptional()
    @IsString()
    public user_id?: string

    @Expose()
    @ApiPropertyOptional({
        description: "The organisation id."
    })
    @IsOptional()
    @IsString()
    public organisation_id?: string

    @Expose()
    @IsNotEmpty()
    public abstract payload: DtoType
}