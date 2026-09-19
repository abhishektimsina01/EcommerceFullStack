import { ITEM_CATEGORY, ORDER_STATUS, ROLES } from "../enum/enums"

// interference is ez, jun typeko data aaune ho tei type banaune ho !?!?!

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
    role : ROLES
    phone_number : number
    address : Iaddress
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

export interface Iorder {
    product : {
        product_id : number
        quantity : number
    }
    current_address : {
        address ?: Iaddress
        default_address ?: boolean
    }
}

export interface Iproduct {
    item_id : number
    product_id : number, 
    product_image : string,
    description ?: string,
    product_name : string,
    price : number
    quantity : number
}

export interface IordersProvider {
    order_id : number
    status : ORDER_STATUS
    cutomer : {
        customer_id : number
        username : string
    },
    payment_id : number | null
    product : Iproduct
}

export interface IorderCustomer {
    order_id : number
    status : ORDER_STATUS
    price : number
    quantity : number
    product : {
        product_id : number,
        product_name : string,
        product_image : string,
        description : string,
    }
    payment_id : number | null
}

export interface IsingleOrderCustomer {
    order_id : number
    address : {
        address_id : number
        state : string
        city : string
    }
    status : ORDER_STATUS
    payment_id : number
    total : number
    products : {
        product_id : number
        product_name : string
        product_image : string
        description : string    
    }
}