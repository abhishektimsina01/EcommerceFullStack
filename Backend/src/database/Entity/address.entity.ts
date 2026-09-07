import { create } from "node:domain";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class Address {

    @PrimaryGeneratedColumn({type : "int"})
    address_id !: number

    @Column({type : "varchar"})
    city !: string

    @Column({type : "varchar"})
    state !: string

    @Column({type : "varchar"})
    address_line !: string

    @Column({type : "int"})
    postal_code !: number

    @Column({type : "decimal"})
    longitude !: number

    @Column({type : "decimal"})
    latitude !: number

    @OneToOne(() => User, (user) => user.address)
    user !: User

    @CreateDateColumn()
    created_at !: Date

}