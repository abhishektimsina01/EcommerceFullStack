import { In, Repository } from "typeorm";
import { ShopCart } from "../database/Entity/shop_cart.entity";
import { ShopCartItem } from "../database/Entity/shop_cart_item.entity";
import { appDataSource } from "../database/connect.db";

export class ShopCartRepository {
    private shopCartRepo : Repository<ShopCart>
    private shopCartItemRepo : Repository<ShopCartItem>

    constructor (){
        this.shopCartRepo = appDataSource.getRepository(ShopCart)
        this.shopCartItemRepo = appDataSource.getRepository(ShopCartItem)
    }

    public findCart =  async (customer_id : number) => {
        return await this.shopCartRepo.findOne({
            where : {
                customer : {
                    customer_id : customer_id
                }
            },
            select : {
                cart_id : true,
                items : {
                    cart_item_id : true
                }
            },
            relations : {
                items : true
            }
        })
    }

    public findCartItems = async (cart_id : number) => {
        return await this.shopCartItemRepo.find({
            where : {
                cart : {
                    cart_id : cart_id
                }
            },
            select : {
                cart_item_id : true,
                product_item : {
                    product_id : true,
                    product_name : true,
                    product_image : true,
                    price : true,
                    product_type : true
                },
            },
            relations : {
                product_item : true
            }
        })
    }

    public createCart = async (customer_id : number) => {
        const new_cart = this.shopCartRepo.create({
            customer : {
                customer_id : customer_id
            }
        })
        return await this.shopCartRepo.save(new_cart)
    }
    
    public addItemInCart = async(cart_id : number, product_id : number) => {
        const new_item = this.shopCartItemRepo.create({
            cart : {
                cart_id : cart_id
            },
            product_item : {
                product_id : product_id
            },
            quantity : 1
        })
        return await this.shopCartItemRepo.save(new_item)
    }

    public deleteCartItem = async (cart_id : number , product_id : number[]) => {
        const cartItem = await this.shopCartItemRepo.find({
            where : {
                cart : {
                    cart_id : cart_id
                },
                product_item : {
                    product_id : In([...product_id])
                }
            }
        })
        return await this.shopCartItemRepo.remove(cartItem)
    }

    public updateItem = async (cart_id : number, product_id : number, qty : number) => {
        await this.shopCartItemRepo.update({
            cart : {
                cart_id : cart_id
            },
            product_item : {
                product_id : product_id
            }
        },{
            quantity : qty
        })
        return await this.shopCartItemRepo.findOne({
            where : {
                cart : {
                    cart_id : cart_id
                },
                product_item : {
                    product_id : product_id
                }
            },
            select : {
                cart_item_id : true,
                product_item : {
                    product_id : true,
                    product_name : true,
                    product_image : true,
                    price : true,
                    product_type : true
                },
            }
        })
    }
}