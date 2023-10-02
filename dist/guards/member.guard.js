"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberGuard = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const logger_1 = __importDefault(require("../logger"));
let MemberGuard = class MemberGuard {
    /**
     * Checks if the requesting user has admin access.
     * @param context The execution context.
     * @param next The next function for passing this middleware.
     */
    async canActivate(context) {
        let user;
        switch (context.getType()) {
            // HTTP:
            case "http":
                user = context.switchToHttp().getResponse().locals.user;
                if (user?.admin) {
                    return true;
                }
                if (!user || user.guest) {
                    throw new common_1.HttpException("Unauthorized.", 401);
                }
                return true;
            // WebSocket:
            case "ws":
                user = context.switchToWs().getData().user;
                if (user?.admin) {
                    return true;
                }
                if (!user || user.guest) {
                    throw new websockets_1.WsException("Unauthorized.");
                }
                return true;
            // Unhandled:
            default:
                logger_1.default.warn(`[Admin Guard] Unhandled context type: ${context.getType()}`);
                return false;
        }
    }
};
MemberGuard = __decorate([
    (0, common_1.Injectable)()
], MemberGuard);
exports.MemberGuard = MemberGuard;
//# sourceMappingURL=member.guard.js.map