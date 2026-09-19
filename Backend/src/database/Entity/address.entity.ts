import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

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

    @CreateDateColumn()
    created_at !: Date

}
