import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { ShopCart } from "./shop_cart.entity";
import { Order } from "./order.entity";

@Entity()
export class Customer {
    @PrimaryGeneratedColumn({type : "int"})
    customer_id !: number
    
    @OneToOne(() => User, {onDelete : "CASCADE"})
    @JoinColumn({name : "user_id"})
    user !: User

    @OneToOne(() => ShopCart, (cart) => cart.customer)
    cart !: ShopCart

    @OneToMany(() => Order, (order) => order.customer)
    orders !: Customer[]
}