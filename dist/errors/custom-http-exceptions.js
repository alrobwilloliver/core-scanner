"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockedHttpException = void 0;
const common_1 = require("@nestjs/common");
class LockedHttpException extends common_1.HttpException {
    constructor(errorMessage) {
        super(errorMessage, 423);
    }
}
exports.LockedHttpException = LockedHttpException;
//# sourceMappingURL=custom-http-exceptions.js.map