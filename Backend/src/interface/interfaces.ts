import { ITEM_CATEGORY, ROLES } from "../enum/enums"

export interface Time {
    date ?: number
    day ?: number
    year ?: number
    month ?: number
    seconds ?: number
    hours : number
    minutes : number
}

export interface ILogIn {
    email : string
    password : string
}

export interface IjwtData {
    id : number
    username : string
    role : ROLES
}

export interface Ipayload {
    id : number 
    username : string
    role : ROLES
    exp ?: number
    iat ?: number
}

export interface Iaddress {
    city : string
    state : string
    postal_code ?: string
    address_line ?: string
    longitude : number
    latitude : number
}

export interface IcustomerSignUp {
    email : string
    password : string
    username : string
    phone_number : number
    address : Iaddress
    role : ROLES
}

export interface IproviderSignUp {
    email : string
    password : string
    username : string
    store_name : string
    role : ROLES
    phone_number : number
    address : Iaddress
    opening_time : string
    closing_time : string
}

export interface Iparams {
    id : string
}

export interface IproductItem {
    product_name : string
    product_type : ITEM_CATEGORY
    description ?: string
    price : number
    stock : number
    product_image ?: string 
}

export interface Ifilters {
    product_type ?: ITEM_CATEGORY
    max ?: number 
    min ?: number
    stock ?: number
}