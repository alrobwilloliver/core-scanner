import { CanActivate, ExecutionContext, HttpException, Injectable } from "@nestjs/common";
import { WsException } from "@nestjs/websockets";

import logger from "../logger";
import { UserBo } from "../bos/user.bo";

@Injectable()
export class MemberGuard implements CanActivate {
    /**
     * Checks if the requesting user has admin access.
     * @param context The execution context.
     * @param next The next function for passing this middleware.
     */
    public async canActivate(context: ExecutionContext): Promise<boolean> {
        let user: UserBo | undefined;
        switch (context.getType()) {
            // HTTP:
            case "http":
                user = context.switchToHttp().getResponse().locals.user as UserBo;
                if (user?.admin) {
                    return true;
                }
                if (!user || user.guest) {
                    throw new HttpException("Unauthorized.", 401);
                }
                return true;

            // WebSocket:
            case "ws":
                user = context.switchToWs().getData().user as UserBo | undefined;
                if (user?.admin) {
                    return true;
                }
                if (!user || user.guest) {
                    throw new WsException("Unauthorized.");
                }
                return true;

            // Unhandled:
            default:
                logger.warn(`[Admin Guard] Unhandled context type: ${context.getType()}`);
                return false;
        }
    }
}
