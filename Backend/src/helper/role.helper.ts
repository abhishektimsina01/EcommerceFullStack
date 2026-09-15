import { ROLES } from "../enum/enums";

export class RoleHelper {
    public isAdmin = (role : ROLES) => {
        return (role === ROLES.ADMIN) ? true : false
    }

    public isCustomer = (role:ROLES) => {
        return (role === ROLES.CUSTOMER) ? true : false
    }

    public isProvider = (role : ROLES) => {
        return (role === ROLES.PROVIDER) ? true : false
    }
}