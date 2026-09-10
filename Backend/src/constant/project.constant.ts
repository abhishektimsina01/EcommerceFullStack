import { ROLES } from "../enum/enums";


export const ResturantProjection = {

    [ROLES.CUSTOMER] : {
        select : {
            product_id : true,
            price : true,
            stock : true,
            provider : {
                provider_id : true,
                store_name : true,
                status : true,
                logo : true,
            },
            product_image : true,
            product_name : true,
            product_type : true,
            description : true
        },
        relation : {
            provider : true
        }
    },

    [ROLES.PROVIDER] : {
        select : {
            product_id : true,
            price : true,
            stock : true,
            product_image : true,
            product_name : true,
            product_type : true,
            description : true
        }
    }
}