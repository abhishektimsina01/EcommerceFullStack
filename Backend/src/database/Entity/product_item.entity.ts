import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity()
export class Product_Item {
    @PrimaryGeneratedColumn({type : "int"})
    item_id !: number

    @Column({type : "int", scale : 2})
    price !: number

    @Column({type : "int"})
    stock !: number

    @ManyToOne(() => Product, (product) => product.items, {onDelete : "CASCADE"})
    @JoinColumn({name : "product_id"})
    product !: Product

}