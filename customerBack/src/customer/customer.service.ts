import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerInfo, LoginDto, emailDTO } from './customer.dto';
import { CustomerEntity, CartEntity, productEntity, sellerEntity, wishlistEntity, OrderedEntity } from './customer.entity';
import * as bcrypt from 'bcrypt';
import { MailerService } from "@nestjs-modules/mailer/dist";



@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity) 
    private customerRepo: Repository<CustomerEntity>,

    @InjectRepository(productEntity) 
      private productRepo: Repository<productEntity>,

    @InjectRepository(sellerEntity) 
      private sellerRepo: Repository<sellerEntity>,

    @InjectRepository(wishlistEntity) 
      private wishlistRepo: Repository<wishlistEntity>,

    @InjectRepository(CartEntity) 
      private cartRepo: Repository<CartEntity>,

    @InjectRepository(OrderedEntity)
    private readonly orderedRepo: Repository<OrderedEntity>,

    private readonly mailerService: MailerService

  )
  {}
  

  //Customer account
// 1. Create customer account Service.
async createAccount(customerInfo): Promise<void> {
  const password = customerInfo.password;
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  customerInfo.password = hashedPassword;
  await this.customerRepo.save(customerInfo);
}

// 2. Read customer account by ID Service.
async customerDetails(username: string): Promise<Partial<CustomerEntity> | undefined> {
  const customer = await this.customerRepo.findOne({ where: { username } });
  if (customer) {
    const customerDetails: Partial<CustomerEntity> = {
      name: customer.name,
      username: customer.username,
      address: customer.address,
      filename: customer.filename,
    };

    return customerDetails;
  } else {
  throw new NotFoundException(`Customer with username ${username} not found`);
  }
}



// 3. Update customer account Put Service.
async updateCustomer(username: string, customerInfo: CustomerInfo): Promise<void> {
  // Fetch the customer by username to get the customer ID
  const customer = await this.customerRepo.findOne({ where: { username } });

  if (!customer) {
    throw new NotFoundException(`Customer with username ${username} not found`);
  }

  // Check if the provided id matches the logged-in customer's id
  if (customerInfo.id && customerInfo.id !== customer.id) {
    throw new UnauthorizedException('Unauthorized update. Customer can only update their own account.');
  }

  // Ensure that the username is not updated
  delete customerInfo.username;

  // Check if a new password is provided
  if (customerInfo.password) {
    const password = customerInfo.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    customerInfo.password = hashedPassword;
  }

  // Update the customer information in the database
  await this.customerRepo.update(customer.id, customerInfo);
}




// 4. Partial Update customer account Patch Service.
async partialUpdateCustomer(username: string, customerInfo: CustomerInfo): Promise<void> {
  // Fetch the customer by username to get the customer ID
  const customer = await this.customerRepo.findOne({ where: { username } });

  if (!customer) {
    throw new NotFoundException(`Customer with username ${username} not found`);
  }

  // Check if the provided id matches the logged-in customer's id
  if (customerInfo.id && customerInfo.id !== customer.id) {
    throw new UnauthorizedException('Unauthorized update. Customer can only update their own account.');
  }

  // Ensure that the username is not updated
  delete customerInfo.username;

  // Check if a new password is provided
  if (customerInfo.password) {
    const password = customerInfo.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    customerInfo.password = hashedPassword;
  }

  // Update the customer information in the database
  await this.customerRepo.update(customer.id, customerInfo);
}


// 5. Delete customer account Service.
async deleteCustomer(username: string): Promise<void> {
  // Fetch the customer by username to get the customer ID
  const customer = await this.customerRepo.findOne({ where: { username } });

  if (!customer) {
    throw new NotFoundException(`Customer with username ${username} not found`);
  }

  // Delete the customer record from the database
  await this.customerRepo.remove(customer);
  
}


// 6.	Upload customer picture Service.
async customerProfilePicture(id: number, customerInfo: CustomerInfo): Promise<CustomerEntity> {
  // Retrieve the customer by ID
  const existingCustomer = await this.customerRepo.findOneBy({id});

  if (!existingCustomer) {
    throw new NotFoundException(`Customer with ID ${id} not found`);
  }

  // Update the customer's profile picture filename
  existingCustomer.filename = customerInfo.filename;

  // Save the updated customer entity
  await this.customerRepo.save(existingCustomer);

  // Return the updated customer entity
  return existingCustomer;
}


    //Cart
    
// 7. Add to Cart Service. (POST)
async addToCart(id: number, quantity: number): Promise<CartEntity> {
  const productRecord = await this.productRepo.findOneBy({id});
  
  // Handle the case where the product with the given ID is not found
  if (!productRecord) {
    throw new NotFoundException(`Product with ID ${id} not found`);
  }

  const cartRecord = new CartEntity();
  cartRecord.id = productRecord.id; 
  cartRecord.name = productRecord.name;  
  cartRecord.price = productRecord.price;
  cartRecord.quantity = quantity;
  cartRecord.total = productRecord.price * quantity;

  return this.cartRepo.save(cartRecord);
}

// 8. Show Cart Service. (GET)
async showCart(): Promise<CartEntity[]> {
  return this.cartRepo.find();
}

// 9. Update Cart Put Service. (PUT)

async updateCart(id: number, cartInfo: Partial<CartEntity>): Promise<void> {
  const existingCart = await this.cartRepo.findOneBy({id});

  if (!existingCart) {
    throw new NotFoundException(`Cart item with ID ${id} not found`);
  }

  const updatedCart = {
    ...existingCart,
    ...cartInfo,
    total: existingCart.price * cartInfo.quantity,
  };

  await this.cartRepo.save(updatedCart);
}



// 10. Partial Update Cart Patch Service. (PATCH)
async partialUpdateCart(id: number, cartInfo: Partial<CartEntity>): Promise<void> {
  const existingCart = await this.cartRepo.findOneBy({id});

  if (!existingCart) {
    throw new NotFoundException(`Cart item with ID ${id} not found`);
  }

  const updatedCart = {
    ...existingCart,
    ...cartInfo,
    total: existingCart.price * cartInfo.quantity,
  };

  await this.cartRepo.save(updatedCart);
}


// 11. Delete Cart Service. (DELETE)
async deleteCart(id: number): Promise<void> {
  await this.cartRepo.delete(id);
}




// 12.	Confirm court order by product ID Service.
async confirmById(id: number): Promise<void> {
  const cartItem = await this.cartRepo.findOneBy({id});

  if (!cartItem) {
    throw new NotFoundException(`Cart item with ID ${id} not found`);
  }

  // Remove from cart
  await this.cartRepo.delete(id);

  // Add to ordered table
  const orderedItem = this.orderedRepo.create(cartItem); // Create a new instance based on the existing cart item
  await this.orderedRepo.save(orderedItem);
}


// 13.	Confirm all order from cart Service.
async confirmAll(): Promise<void> {
  const cartItems = await this.cartRepo.find();

  if (!cartItems || cartItems.length === 0) {
    throw new NotFoundException('No items found in the cart');
  }

  // Remove all items from cart
  await this.cartRepo.clear();

  // Add all items to ordered table
  const orderedItems = cartItems.map((cartItem) => {
    const orderedItem = new OrderedEntity();
    orderedItem.name = cartItem.name;
    orderedItem.price = cartItem.price;
    orderedItem.quantity = cartItem.quantity;
    orderedItem.total = cartItem.total;
    return orderedItem;
  });

  await this.orderedRepo.save(orderedItems);
}




// 14.	Show ordered items Service.
async showAllOrders(): Promise<OrderedEntity[]> {
  return this.orderedRepo.find();
}



// wishlist

// 15.	Create wishlist Service. 
async createWishlist(id: number, username: string): Promise<wishlistEntity> {
  if (id <= 0) {
    throw new BadRequestException('Invalid ID. ID must be greater than 0.');
  }

  const productRecord = await this.productRepo.findOneBy({ id });

  if (!productRecord) {
    throw new NotFoundException(`Record with ID ${id} not found`);
  }

  // Fetch the customer by username to get the customer ID
  const customer = await this.customerRepo.findOne({ where: { username } });

  if (!customer) {
    throw new NotFoundException(`Customer with username ${username} not found`);
  }

  const wishlistRecord = new wishlistEntity();
  // wishlistRecord.id = wishlistRecord.id;
  wishlistRecord.name = productRecord.name;
  wishlistRecord.description = productRecord.description;
  wishlistRecord.price = productRecord.price;

  // Set the customer ID for the wishlist record
  wishlistRecord.customerwish = customer;
  wishlistRecord.product = productRecord;
  return await this.wishlistRepo.save(wishlistRecord);
}


// 16.	Read wishlist Service. 
async getAllWishlistDetails(username: string)
{
  const customer = await this.customerRepo.findOne({ where: { username } });
 return this.wishlistRepo.find(
    {
      where: { customerwish: { id: customer.id } },
      relations: {customerwish:true}
    // relations: ['customerwish', 'product'], 

    }
  )
}



// 17.	delete products from wishlist by productid Service.
async deleteWishlist(id: number, username: string): Promise<void> {
  const customer = await this.customerRepo.findOne({ where: { username } });

  if (!customer) {
    throw new NotFoundException(`Customer with username ${username} not found`);
  }

  const wishlistItem = await this.wishlistRepo.findOne({
    where: { id, customerwish: { id: customer.id } },
    relations: ['customerwish', 'product'],
  });

  if (!wishlistItem) {
    throw new NotFoundException(`Wishlist item with ID ${id} not found for the customer`);
  }

  await this.wishlistRepo.remove(wishlistItem);
}
      
    // 18.	Read seller details by ID Service.
    sellerDetails(id:number)
    {
    return this.sellerRepo.find(
        {
          where: {id:id},

        }
      )
    }
      
    // 19.	Read product details by ID Service.
    productDetails(id:number)
    {
      return this.productRepo.find(
        {
         where: {id:id},
         
        }
        )
      }
      
      
      // 20.	Login Service. (সেশন ব্যবহার করা বাকী,এখান থেকে শুরু)
      async login(loginDto: LoginDto) {
        const { username, password } = loginDto;
        const customer = await this.customerRepo.findOne({ where: { username } });
      
        if (customer && (await bcrypt.compare(password, customer.password))) {
          // Passwords match, return the customer
          return "Login Succesfull";
        }

      }

//21. Get products of a customer (GET)
      getProductsOfACustomer(id:number)
      {
      return this.customerRepo.find(
          {
            where: {id:id},
            relations: {products:true}

          }
        )
      }
//22. Get customers of all products. (POST)
      getCustomersOfAllProduct()
      {
      return this.productRepo.find(
        {
          // where: {id:id},
          relations: {customer:true}

        }

      )

      }


       //23. Mailer

      async sendEmail(emailData: emailDTO): Promise<void> {
        await this.mailerService.sendMail({
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.text,
        });
      }     


  }
  