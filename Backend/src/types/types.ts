import { IcustomerSignUp, IproviderSignUp } from "../interface/interfaces"

export type detailType<T> = T | null
export type signUpType = IcustomerSignUp | IproviderSignUp
export type userType = Omit<IcustomerSignUp, "address"> & {address : {address_id : number}}
export type customerType = { user_id : number}
export type providerType = Omit<IproviderSignUp, keyof IcustomerSignUp>