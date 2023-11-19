import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseInterceptors, UploadedFile, ParseIntPipe, UsePipes, ValidationPipe, Session, UseGuards, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CartEntity, CustomerEntity } from './customer.entity';
import { CustomerInfo, LoginDto, emailDTO } from './customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from "multer";
import { SessionGuard } from './customer.guards';


@Controller()
export class CustomerController {
  constructor(private readonly CustomerService: CustomerService) {}

  //Customer Account
  //1. Create customer account Controller. (POST)
@Post('/createaccount')
@UsePipes(new ValidationPipe()) 
async createAccount(@Body() customerInfo): Promise<string> {
  await this.CustomerService.createAccount(customerInfo);
  return 'Account created successfully';
}

// 2. Read customer account by ID Controller. (GET)
@Get('customerdetails')
@UseGuards(SessionGuard)
async customerDetails(@Session() session): Promise<Partial<CustomerEntity>> {
  const customerDetails = await this.CustomerService.customerDetails(session.username);
  if (!customerDetails) {
    throw new NotFoundException(`Customer with username ${session.username} not found`);
  }
  return customerDetails;
}


// 3. Update customer account Controller. (PUT)
@Put('/update')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe()) 
async updateCustomer(@Session() session, @Body() customerInfo: CustomerInfo): Promise<string> {
  await this.CustomerService.updateCustomer(session.username, customerInfo);
  return 'Account updated successfully';
}


// 4. Partial Update customer account Controller. (PATCH)
@Put('/partialUpdate')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe()) 
async partialUpdateCustomer(@Session() session, @Body() customerInfo: CustomerInfo): Promise<string> {
  await this.CustomerService.partialUpdateCustomer(session.username, customerInfo);
  return 'Account updated successfully';
}
// 5. Delete customer account Controller. (DELETE)
@Delete('deleteAccount')
@UseGuards(SessionGuard)
async deleteCustomer(@Session() session): Promise<string> {
  await this.CustomerService.deleteCustomer(session.username);
  
  return 'Account deleted successfully';
}


// 6.	Upload customer picture Controller. (Post)
@Post('customerProfilePicture/:id')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe())
@UseInterceptors(FileInterceptor('profilepic',
{ fileFilter: (req, file, cb) => {
  if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
   cb(null, true);
  else {
   cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
   }
  },
  limits: { fileSize: 30000 },
  storage:diskStorage({
  destination: './upload',
  filename: function (req, file, cb) {
   cb(null,Date.now()+file.originalname)
  },
  })
}
))
customerProfilePicture(
  @Param('id') id: number, @Body() customerInfo: CustomerInfo, 
  @UploadedFile() myfile: Express.Multer.File,
) {
  customerInfo.filename = myfile.filename;
  return this.CustomerService.customerProfilePicture(id, customerInfo);
}


  //Cart

// 7. Add to Cart Controller. (POST)
@Post('addToCart/:id')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe()) 
async addToCart(@Param('id') id: number, @Body('quantity') quantity: number): Promise<{ message: string, addItem: CartEntity }> {
  const addItem = await this.CustomerService.addToCart(id, quantity);
  return { message: 'Item added to cart successfully', addItem };
}

// 8. Show Cart Controller. (GET)
@Get('showCart')
@UseGuards(SessionGuard)
async showCart(): Promise<CartEntity[]> {
  const cartItems = await this.CustomerService.showCart();
  return cartItems;
}


// 9. Update Cart Controller. (PUT)
@Put('/updateCart/:id')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe()) 
async updateCart(@Param('id') id: number, @Body('quantity') quantity: number): Promise<string> {
  await this.CustomerService.updateCart(id, { quantity });
  return 'Cart updated successfully';
}



// 10. Partial Update Cart Controller. (PATCH)
@Patch('/partialupdateCart/:id')
@UseGuards(SessionGuard)
@UsePipes(new ValidationPipe()) 
async partialUpdateCart(@Param('id') id: number, @Body('quantity') quantity: number): Promise<string> {
  await this.CustomerService.partialUpdateCart(id, { quantity });
  return 'Cart updated successfully';
}



// 11. Delete Cart Controller. (DELETE)
@Delete('deleteCart/:id')
@UseGuards(SessionGuard)
async deleteCart(@Param('id') id: number): Promise<string> {
  await this.CustomerService.deleteCart(id);
  return 'Cart item deleted successfully';
}




// 12.	Confirm cart order by product ID Controller. (POST) 
@Post('/confirmById/:id')
@UseGuards(SessionGuard)
async confirmById(@Param('id') id: number): Promise<string> {
  await this.CustomerService.confirmById(id);
  return 'Item moved from cart to ordered table successfully';
}


// 13.	Confirm all order from cart Controller. (POST)
@Post('/confirmAll')
@UseGuards(SessionGuard)
async confirmAll(): Promise<string> {
  await this.CustomerService.confirmAll();
  return 'All items moved from cart to ordered table successfully';
}



// 14.	Show ordered items Controller. (GET)
  @Get('/showAllOrders')
  @UseGuards(SessionGuard)
  showAllOrders() {
    return this.CustomerService.showAllOrders();
  }

  // wishlist
  // 15.	Create wishlist Controller. (POST)
  @Post('createWishlist/:id')
@UseGuards(SessionGuard)
async createWishlist(
  @Param('id', ParseIntPipe) id: number,
  @Session() session
) {
  const username = session.username; // Assuming you have the customer's username in the session
  const wishedItem = await this.CustomerService.createWishlist(id, username);
  return { message: 'Record copied successfully', wishedItem };
}
  
  
  // 16.	Read wishlist Controller. (GET)
  @Get('allWishlistDetails')
  @UseGuards(SessionGuard)
  allWishlistDetails(
    @Session() session
  ) {
    const username = session.username;
    return this.CustomerService.getAllWishlistDetails(username);
  }
  
  
  // 17.	delete products from wishlist by productid Controller. (DELETE)
@Delete('deleteFromWishlist/:id')
@UseGuards(SessionGuard)
async deleteWishlist(@Param('id') id: number, @Session() session): Promise<string> {
  const username = session.username;
  await this.CustomerService.deleteWishlist(id, username);
  return 'Wishlist item deleted successfully';
}



  
  // 18.	Read seller details by ID Controller. (GET)
  @Get('sellerdetails/:id')
  sellerDetails(@Param('id', ParseIntPipe) id:number)
  {
    return this.CustomerService.sellerDetails(id);
  }

  // 19.	Read product details by ID Controller. (GET)
  @Get('productdetails/:id')
  productDetails(@Param('id', ParseIntPipe) id:number)
  {
    return this.CustomerService.productDetails(id);
  }
  
  
  
  // 20.	Login controller. (POST)
  @Post('login')
  async login(@Body() loginDto:LoginDto,
  @Session() session)
  {
   if(await this.CustomerService.login(loginDto))
   {
    
    session.username=loginDto.username;
    return this.CustomerService.login(loginDto);
   }
   else
   {
    throw new HttpException('Unauthorized login', 
    HttpStatus.UNAUTHORIZED); 
  
   }
  }
//21. Get products of a customer (GET)

  @Get(':customerId/products')
  async getProductsOfACustomer(@Param('customerId') customerId: number) {
    return this.CustomerService.getProductsOfACustomer(customerId);
  }

//22. Get customers of all products. (POST)
  @Get('allProducts/customer')
  getCustomersOfAllProduct()
  {
    return this.CustomerService.getCustomersOfAllProduct();
  }


  //23. Mailer

  @Post('sendEmail')
  async sendEmail(@Body() emailData: emailDTO): Promise<string> {
    await this.CustomerService.sendEmail(emailData);
    return 'Email sent successfully';
  }

 

  




}




