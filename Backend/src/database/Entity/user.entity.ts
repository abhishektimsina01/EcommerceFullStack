import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { ROLES } from "../../enum/enums";
import { Address } from "./address.entity";


@Entity()
@Unique(["email", "phone_number"])
export class User {

    @PrimaryGeneratedColumn({type : "int"})
    user_id !: number

    @Column({type : "varchar"})
    email !: string

    @Column({type : "varchar"})
    password !: string

    @Column({type : "enum", enum : ROLES, default : ROLES.CUSTOMER})
    role !: ROLES

    @Column({type : "int", precision : 10})
    phone_numebr !: number

    @OneToOne(() => Address, (address) => address.user)
    @JoinColumn({name : "address_id"})  
    address !: Address

    @CreateDateColumn()
    created_at !: Date

    @UpdateDateColumn()
    updated_at !: Date

    @DeleteDateColumn({nullable : true})
    deleted_at !: Date | null

}