import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Customer } from "./customer.entity";
import { OrderItem } from "./order_item.entity";
import { ORDER_STATUS } from "../../enum/enums";
import { Payment } from "./payment.entity";
import { Address } from "./address.entity";

@Entity()
export class Order {

    @PrimaryGeneratedColumn({type : "int"})
    order_id !: number

    @Column({type : "enum", enum : ORDER_STATUS, default : ORDER_STATUS.PENDING})
    status !: ORDER_STATUS

    @ManyToOne(() => Customer, (customer) => customer.orders, {onDelete : "CASCADE"})
    @JoinColumn({name : "customer_id"})
    customer !: Customer

    @Column({type : "varchar", nullable : true})
    session_id !: string

    @OneToOne(() => Address)
    @JoinColumn({name : "address_id"})
    address !: Address

    @OneToOne(() => Payment, (payment) => payment.order, {nullable : true})
    @JoinColumn({name : "payment_id"})
    payment !: Payment
    
    @OneToMany(() => OrderItem, (item) => item.order)
    items !: OrderItem[]

}