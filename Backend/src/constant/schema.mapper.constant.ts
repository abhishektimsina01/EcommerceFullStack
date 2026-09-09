import { ROLES } from "../enum/enums";
import { signUpCustomerSchema, signUpProviderScehma } from "../validation/auth.validation";

export const SignupSchema = {
    [ROLES.CUSTOMER] : signUpCustomerSchema,
    [ROLES.PROVIDER] : signUpProviderScehma
}