export declare class UserBo {
    admin: boolean;
    readonly guest: boolean;
    readonly id: string;
    readonly username: string;
    readonly emails: string[];
    readonly organisationId: string;
    readonly data: Record<string, any>;
    readonly roles: string[];
    readonly scopes: string[];
    /**
     * Constructor
     * @param data Basic user information.
     * @param roles A collection of roles this user has sorted by service name.
     * @param scopes An array of scopes that this user instance has for a request.
     */
    constructor(data: Record<string, any>, roles: string[], scopes: string[]);
    /**
     * Creates an empty server user, this has full admin privileges.
     * @return An empty server user for authless endpoints or server keys.
     */
    static serverUser(): UserBo;
    /**
     * Creates an empty guest user, this has no privileges.
     * @return An empty guest user for authless endpoints.
     */
    static guestUser(): UserBo;
    /**
     * Creates a user from an authentication user claim (usually from a jwt).
     * @param claim The user claim which should contain basic user data.
     * @return An auth payload populated User instance.
     */
    static fromClaim(claim: Record<string, any>): UserBo;
    /**
     * Checks if this user has the specified role.
     * @param role The role to check for.
     * @returns True if this user has the role or is an admin.
     */
    hasRole(role: string): boolean;
    /**
     * Checks if this user has all of the specified roles.
     * @param roles The roles to check for.
     * @returns True if this user has all of the roles or is an admin.
     */
    hasRoles(roles: string[]): boolean;
    /**
     * Determines if this user has the provided organisation id.
     * @param organisationId The organisation id to check.
     */
    hasOrganisationId(organisationId: string): boolean;
}
//# sourceMappingURL=user.bo.d.ts.map