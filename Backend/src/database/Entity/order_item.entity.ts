import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product } from "./product.entity";
import { Address } from "./address.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn({type : "int"})
    item_id !: number

    @OneToOne(() => Product, {onDelete : "CASCADE"})
    @JoinColumn({name : "product_item_id"})
    product !: Product

    @Column({type : "int", scale : 2})
    price !: number

    @Column({type : "int"})
    quantity !: number

    @ManyToOne(() => Order, (order) => order.items, {onDelete : "CASCADE"})
    @JoinColumn({name : "order_id"})
    order !: Order
}