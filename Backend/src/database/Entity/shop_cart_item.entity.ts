import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShopCart } from "./shop_cart.entity";
import { Product_Item } from "./product_item.entity";

@Entity()
export class ShopCartItem {

    @PrimaryGeneratedColumn({type : "int"})
    cart_item_id !: number

    @ManyToOne(() => ShopCart, (cart) => cart.items, {onDelete : "CASCADE"})
    @JoinColumn({name : "cart_id"})
    cart !: ShopCart

    @OneToOne(() => Product_Item, {onDelete : "CASCADE"})
    @JoinColumn({name : "product_item_id"})
    product_item !: Product_Item

}