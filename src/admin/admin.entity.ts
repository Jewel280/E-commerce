import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("admin")
export class AdminEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    username:string;

    @Column()
    email:string;

    @Column()
    password:string;

    @Column()
    phone:string;

    
}



@Entity("seller")
	export class SellerEntity{
        
		@PrimaryGeneratedColumn()
		id:number;

		@Column()
		name:string;

        @Column()
		product_id:string;

		@Column()
		product_name:string;

		@Column()
		product_description:string;

        @Column()
        price:string;
        admin: any;

	}

    @Entity("user")
	export class UserEntity{
        
		@PrimaryGeneratedColumn()
		id:number;

		@Column()
		name:string;

        @Column()
		password:string;

		@Column()
		email:string;

		@Column()
		nid:string;

		@Column()
		address:string;

		@Column()
		status:string

		@Column({ nullable: true })
		approval:string | null;


		@OneToMany(() => SellerEntity, (seller) => seller.admin)
		managers: SellerEntity[]


		@OneToMany(() => CustomerEntity, (customer) => customer.admin)
	  customer: CustomerEntity[]
      firstName: string;
      lastName: string;
      username: string;
      phone: string;
    }

    @Entity("customer")
	export class CustomerEntity{
        
		@PrimaryGeneratedColumn()
		id:number;

		@Column()
		name:string;

		@Column()
		product_name:string;

		@Column()
		product_price:string;

		@Column()
		seller_name:string;
	    admin: any;

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
}