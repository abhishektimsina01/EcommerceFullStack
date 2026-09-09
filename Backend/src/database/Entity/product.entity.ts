import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ITEM_CATEGORY } from "../../enum/enums";
import { Provider } from "./provider.entity";

@Entity()
export class Product {

    @PrimaryGeneratedColumn({type : "int"})
    product_id !: number

    @Column({type : "varchar"})
    product_name !: string

    @Column({type : "enum", enum : ITEM_CATEGORY, default : ITEM_CATEGORY.OTHER})
    product_type !: ITEM_CATEGORY

    @Column({type : "varchar", nullable : true})
    description !: string

    @Column({type : "varchar", nullable : true})
    product_image !: string

    @Column({type : "int", scale : 2})
    price !: number

    @Column({type : "int"})
    stock !: number
    
    @ManyToOne(() => Provider, (provider) => provider.products, {onDelete : "CASCADE"})
    @JoinColumn({name : "provider_name"})
    provider !: Provider

}