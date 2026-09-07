import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";


@Entity()
export class Admin{

    @PrimaryGeneratedColumn({type : "int"})
    admin_id !: number

    @Column({type : "varchar"})
    username !: string

    @OneToOne(() => User)
    user !: User

}