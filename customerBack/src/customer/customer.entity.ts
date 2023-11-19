import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("customer")
export class CustomerEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    username: string;
    @Column()
    password: string;
    @Column()
    address: string;
    @Column({ nullable: true })
    filename: string | null;

    @OneToMany(() => wishlistEntity, wishlistItem => wishlistItem.customerwish)
    wishlist: wishlistEntity[];


    @ManyToMany(() => productEntity, product => product.customer)
    @JoinTable()
    products: productEntity[];
}

@Entity("product")
export class productEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    price: number;

    @ManyToMany(() => CustomerEntity, customer => customer.products)
    customer: CustomerEntity[];

    @OneToMany(() => wishlistEntity, wishlistItem => wishlistItem.product)
  wishlists: wishlistEntity[];

}

@Entity("seller")
export class sellerEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    email: string;
    @Column()
    contact: number;

    

}
@Entity("wishlist")
export class wishlistEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    description: string;
    @Column()
    price: number;

    @ManyToOne(() => CustomerEntity, customer => customer.wishlist)
    customerwish: CustomerEntity;

    @ManyToOne(() => productEntity, product => product.wishlists)
  @JoinColumn({ name: "productId" })
  product: productEntity;

}
@Entity("cart")
export class CartEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    price: number;
    @Column()
    quantity: number;
    @Column()
    total: number;


}

@Entity("ordered")
export class OrderedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  total: number;

  
}