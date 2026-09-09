import { Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { JoinColumn } from "typeorm/browser";
import { ShopCartItem } from "./shop_cart_item.entity";

@Entity()
export class ShopCart {

    @PrimaryGeneratedColumn({type : "int"})
    cart_id !: number

    @OneToOne(() => Customer, (customer) => customer.cart, {onDelete : "CASCADE"})
    @JoinColumn({name : "customer_id"})
    customer !: Customer

    @OneToMany(() => ShopCartItem, (cart) => cart.cart)
    items !: ShopCartItem[]

}