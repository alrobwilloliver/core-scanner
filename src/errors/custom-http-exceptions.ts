import { HttpException } from "@nestjs/common";

export class LockedHttpException extends HttpException {
    constructor(errorMessage: string) {
        super(errorMessage, 423);
    }
}