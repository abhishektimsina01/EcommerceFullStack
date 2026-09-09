import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Product_Item } from "./product_item.entity";

@Entity()
export class OrderItem {
    @PrimaryGeneratedColumn({type : "int"})
    item_id !: number

    @OneToOne(() => Product_Item, {onDelete : "CASCADE"})
    @JoinColumn({name : "product_item_id"})
    product_item !: Product_Item

    @Column({type : "int", scale : 2})
    price !: number

    @Column({type : "int"})
    quantity !: number

    @ManyToOne(() => Order, (order) => order.items, {onDelete : "CASCADE"})
    @JoinColumn({name : "order_id"})
    order !: Order
}