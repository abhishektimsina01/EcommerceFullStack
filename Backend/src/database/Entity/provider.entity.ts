import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PROVIDER_STATUS } from "../../enum/enums";
import { User } from "./user.entity";
import { Product } from "./product.entity";

@Entity()
export class Provider {

    @PrimaryGeneratedColumn({type : "int"})
    provider_id !: number

    @Column({type : "varchar"})
    store_name !: string

    @Column({type : "varchar", nullable : true})
    logo !: string

    @Column({type : "enum", enum : PROVIDER_STATUS, default : PROVIDER_STATUS.ACTIVE})
    status !: PROVIDER_STATUS

    @Column({type : "time"})
    opening_time !: string

    @Column({type : "time"})
    closing_time !: string

    @OneToOne(() => User, {onDelete : "CASCADE"})
    @JoinColumn({name : "user_id"})
    user !: User

    @OneToMany(() => Product, (product) => product.provider)
    products !: Product[]
}