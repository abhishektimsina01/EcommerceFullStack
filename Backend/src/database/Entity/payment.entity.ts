import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class Payment{

    @PrimaryGeneratedColumn({type : "int"})
    payment_id !: number

    @Column({type : "varchar"})
    payment_idx !: string

    @OneToOne(() => Order, (order) => order.payment)
    order !: Order
    
}