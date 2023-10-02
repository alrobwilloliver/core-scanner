import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class MemberGuard implements CanActivate {
    /**
     * Checks if the requesting user has admin access.
     * @param context The execution context.
     * @param next The next function for passing this middleware.
     */
    canActivate(context: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=member.guard.d.ts.map