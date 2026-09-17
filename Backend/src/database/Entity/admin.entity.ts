import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class Admin{

    @PrimaryGeneratedColumn({type : "int"})
    admin_id !: number

    @OneToOne(() => User, {onDelete : "CASCADE"})
    @JoinColumn({name : "user_id"})
    user !: User

}