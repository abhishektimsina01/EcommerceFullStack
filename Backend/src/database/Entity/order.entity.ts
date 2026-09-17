import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { ORDER_STATUS } from "../../enum/enums";
import { Payment } from "./payment.entity";
import { Address } from "./address.entity";
import { Product } from "./product.entity";

@Entity()
export class Order {

    @PrimaryGeneratedColumn({type : "int"})
    order_id !: number

    @Column({type : "enum", enum : ORDER_STATUS, default : ORDER_STATUS.PENDING})
    status !: ORDER_STATUS

    @ManyToOne(() => Customer, (customer) => customer.orders, {onDelete : "CASCADE"})
    @JoinColumn({name : "customer_id"})
    customer !: Customer

    @Column({type : "int", scale : 2})
    price !: number

    @Column({type : "int"})
    quantity !: number

    @OneToOne(() => Address, {onDelete : "CASCADE"})
    @JoinColumn({name : "address_id"})
    address !: Address

    @OneToOne(() => Payment, (payment) => payment.order, {nullable : true})
    @JoinColumn({name : "payment_id"})
    payment !: Payment

    @ManyToOne(() => Product, {onDelete : "CASCADE"})
    @JoinColumn({name : "product_id"})
    product !: Product

}