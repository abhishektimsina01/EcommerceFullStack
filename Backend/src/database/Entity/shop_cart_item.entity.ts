import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ShopCart } from "./shop_cart.entity";
import { Product } from "./product.entity";

@Entity()
export class ShopCartItem {

    @PrimaryGeneratedColumn({type : "int"})
    cart_item_id !: number

    @Column({type : "int", default : 1})
    quantity !: number

    @ManyToOne(() => ShopCart, (cart) => cart.items, {onDelete : "CASCADE"})
    @JoinColumn({name : "cart_id"})
    cart !: ShopCart

    @ManyToOne(() => Product, {onDelete : "CASCADE"})
    @JoinColumn({name : "product_item_id"})
    product_item !: Product

}