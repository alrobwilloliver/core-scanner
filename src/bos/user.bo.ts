import { v4 as uuid } from "uuid";

export class UserBo {
    public admin: boolean // True if this user is an admin and should bypass authentication filtering.
    public readonly guest: boolean // True if this is a guest user (not authenticated).
    public readonly id: string;
    public readonly username: string;
    public readonly emails: string[];
    public readonly organisationId: string;
    public readonly data: Record<string, any>;
    public readonly roles: string[];
    public readonly scopes: string[];

    /**
     * Constructor
     * @param data Basic user information.
     * @param roles A collection of roles this user has sorted by service name.
     * @param scopes An array of scopes that this user instance has for a request.
     */
    public constructor(data: Record<string, any>, roles: string[], scopes: string[]) {
        this.admin = (data.admin ?? false) === true;
        this.guest = (data.guest ?? false) === true;
        this.id = data.id ?? uuid();
        this.username = data.username ?? (this.admin ? "server" : "guest");
        this.emails = data.emails ?? [];
        if (data.organisations) { // TODO: Temp get first of multiple orgs, simplify once single org jwts are live.
            this.organisationId = data.organisations[0]?.id ?? ""
        } else {
            this.organisationId = data.organisationId ?? "";
        }
        this.data = data;
        this.roles = roles;
        this.scopes = scopes;
    }

    /**
     * Creates an empty server user, this has full admin privileges.
     * @return An empty server user for authless endpoints or server keys.
     */
    public static serverUser(): UserBo {
        return new UserBo({
            admin: true,
            guest: true,
        }, [], []);
    }

    /**
     * Creates an empty guest user, this has no privileges.
     * @return An empty guest user for authless endpoints.
     */
    public static guestUser(): UserBo {
        const user = new UserBo({
            guest: true,
        }, [], []);
        return user;
    }

    /**
     * Creates a user from an authentication user claim (usually from a jwt).
     * @param claim The user claim which should contain basic user data.
     * @return An auth payload populated User instance.
     */
    public static fromClaim(claim: Record<string, any>): UserBo {
        const roles: string[] = claim.roles ?? [];
        const scopes: string[] = claim.scopes ?? [];
        return new UserBo(claim, roles, scopes);
    }

    /**
     * Checks if this user has the specified role.
     * @param role The role to check for.
     * @returns True if this user has the role or is an admin.
     */
    public hasRole(role: string): boolean {
        if (this.admin) {
            return true;
        }
        return this.roles.includes(role);
    }

    /**
     * Checks if this user has all of the specified roles.
     * @param roles The roles to check for.
     * @returns True if this user has all of the roles or is an admin.
     */
    public hasRoles(roles: string[]): boolean {
        if (this.admin) {
            return true
        }
        return !roles.find(role => !this.roles.includes(role))
    }

    /**
     * Determines if this user has the provided organisation id.
     * @param organisationId The organisation id to check.
     */
    public hasOrganisationId(organisationId: string): boolean {
        if (this.data.organisations && this.data.organisations.find((organisation: Record<string, any>) => organisation.id === organisationId)) { // TODO: Temp multiple org check, remove once single org jwts are live.
            return true;
        }
        return this.organisationId === organisationId;
    }
}