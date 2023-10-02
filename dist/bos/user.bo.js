"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserBo = void 0;
const uuid_1 = require("uuid");
class UserBo {
    admin; // True if this user is an admin and should bypass authentication filtering.
    guest; // True if this is a guest user (not authenticated).
    id;
    username;
    emails;
    organisationId;
    data;
    roles;
    scopes;
    /**
     * Constructor
     * @param data Basic user information.
     * @param roles A collection of roles this user has sorted by service name.
     * @param scopes An array of scopes that this user instance has for a request.
     */
    constructor(data, roles, scopes) {
        this.admin = (data.admin ?? false) === true;
        this.guest = (data.guest ?? false) === true;
        this.id = data.id ?? (0, uuid_1.v4)();
        this.username = data.username ?? (this.admin ? "server" : "guest");
        this.emails = data.emails ?? [];
        if (data.organisations) { // TODO: Temp get first of multiple orgs, simplify once single org jwts are live.
            this.organisationId = data.organisations[0]?.id ?? "";
        }
        else {
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
    static serverUser() {
        return new UserBo({
            admin: true,
            guest: true,
        }, [], []);
    }
    /**
     * Creates an empty guest user, this has no privileges.
     * @return An empty guest user for authless endpoints.
     */
    static guestUser() {
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
    static fromClaim(claim) {
        const roles = claim.roles ?? [];
        const scopes = claim.scopes ?? [];
        return new UserBo(claim, roles, scopes);
    }
    /**
     * Checks if this user has the specified role.
     * @param role The role to check for.
     * @returns True if this user has the role or is an admin.
     */
    hasRole(role) {
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
    hasRoles(roles) {
        if (this.admin) {
            return true;
        }
        return !roles.find(role => !this.roles.includes(role));
    }
    /**
     * Determines if this user has the provided organisation id.
     * @param organisationId The organisation id to check.
     */
    hasOrganisationId(organisationId) {
        if (this.data.organisations && this.data.organisations.find((organisation) => organisation.id === organisationId)) { // TODO: Temp multiple org check, remove once single org jwts are live.
            return true;
        }
        return this.organisationId === organisationId;
    }
}
exports.UserBo = UserBo;
//# sourceMappingURL=user.bo.js.map