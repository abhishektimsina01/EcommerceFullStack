import { ROLES } from "../enum/enums";
import { signUpAdminScehma, signUpCustomerSchema } from "../validation/auth.validation";

export const SignupSchema = {
    [ROLES.CUSTOMER] : signUpCustomerSchema,
    [ROLES.ADMIN] : signUpAdminScehma
}