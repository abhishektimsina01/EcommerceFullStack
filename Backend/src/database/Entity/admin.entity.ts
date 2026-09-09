import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import Joi from "joi";


@Entity()
export class Admin{

    @PrimaryGeneratedColumn({type : "int"})
    admin_id !: number

    @OneToOne(() => User, {onDelete : "CASCADE"})
    @JoinColumn({name : "admin_id"})
    user !: User

}