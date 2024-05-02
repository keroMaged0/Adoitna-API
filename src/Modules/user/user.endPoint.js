import { systemRoles } from "../../Utils/system-roles.js";

export const endPointRoles = {
    ALL_ACCESS: [systemRoles.ADMIN, systemRoles.USER, systemRoles.PATENT, systemRoles.DONATION],
    ADMIN_ROLES: [systemRoles.ADMIN],
    USER_ROLES: [systemRoles.USER],
    PATENT_ROLES: [systemRoles.PATENT],
    DONATION_ROLES: [systemRoles.DONATION],

}