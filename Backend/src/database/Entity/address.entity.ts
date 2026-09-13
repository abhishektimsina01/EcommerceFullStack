import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class Address {

    @PrimaryGeneratedColumn({type : "int"})
    address_id !: number

    @Column({type : "varchar"})
    city !: string

    @Column({type : "varchar"})
    state !: string

    @Column({type : "varchar", nullable : true})
    address_line !: string | null

    @Column({type : "varchar", nullable : true})
    postal_code !: string | null

    @Column({type : "decimal"})
    longitude !: number

    @Column({type : "decimal"})
    latitude !: number

    @CreateDateColumn()
    created_at !: Date

}