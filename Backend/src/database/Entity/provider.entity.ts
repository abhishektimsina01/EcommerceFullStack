import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { PROVIDER_STATUS } from "../../enum/enums";
import { User } from "./user.entity";

@Entity()
export class Provider {

    @PrimaryGeneratedColumn({type : "int"})
    provider_id !: number

    @Column({type : "varchar"})
    logo !: string

    @Column({type : "enum", enum : PROVIDER_STATUS, default : PROVIDER_STATUS.ACTIVE})
    status !: PROVIDER_STATUS

    @Column({type : "time"})
    opening_time !: string

    @Column({type : "time"})
    closing_time !: string

    @OneToOne(() => User)
    @JoinColumn({name : "user_id"})
    user !: User
}