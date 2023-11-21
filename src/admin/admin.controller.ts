import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Req, Res, Session, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminInfo, emailDTO } from './admin.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterError, diskStorage } from 'multer';
import { AdminEntity } from './admin.entity';
import { SessionGuard } from './admin.guards';
import * as bcrypt from 'bcrypt';


@Controller('admin')
//@UseGuards(SessionGuard)
export class AdminController {
  adminRepo: any;
  CustomerService: any;
  mailerService: any;
  constructor(private adminService: AdminService) {}

  
//   @Get('index')
//   @UseGuards(SessionGuard)
//   getIndex(@Session() session) {
// console.log(session.email);
//     return this.adminService.getAll();
    
//   }



  //*****Admin Registration ******/
@Post('/adminRegistration')
@UsePipes(new ValidationPipe())
async signupadmin(
  @Body() adminInfo: AdminInfo,
) {
  const admin = await this.adminService.signupadmin(adminInfo);

  if (admin === 'Admin exist') {
    return { message: 'Admin exists' };
  } else if (admin === 'Admin added successfully') {
    return { message: 'Success' };
  }
}
//****Admin login ****/


@Post('adminLogin')
async loginnn(@Body() signinData: { username: string; password: string }) {
  const admin = await this.adminService.loginnn(signinData.username);

  if (!admin) {
    return { message: 'Admin not found' };
  }

  const isPasswordValid = await bcrypt.compare(signinData.password, admin.password);

  if (isPasswordValid) {
    return { message: 'Login successful' };
  } else {
    throw new HttpException('Invalid name or password', HttpStatus.UNAUTHORIZED);
  }
}




//*********Registration_request************* */

@Post('/userRegistration')
@UsePipes(new ValidationPipe())
async registrationuser(
  @Body() registrationdto: {
    name: string;
    password: string;
    email: string;
    nid: number;
    address: string;
    status: string;
  }
) {
  const user= await this.adminService.registrationuser(registrationdto);
  if(user==="User exist"){
    return { message: 'user exist' };
  }else if(user==="User added Successfull"){
    return { message: 'Success'};
  }
}


  // //*********Log_in***************** */
  // @Post('/Uerlogin')
  // async login(@Body() loginData: { username: string; password: string }) {
  //   const admin = await this.adminservice.login(loginData.username);

  //   if (!admin) {
  //     return { message: 'admin not found' }; 
  //   }

  //   const isPasswordValid = await bcrypt.compare(loginData.password, admin.password);

  //   if (isPasswordValid) {
  //     return { message: 'Login successful' };
  //   } else {
  //     throw new HttpException ('Invalid name or password', HttpStatus.UNAUTHORIZED);
  //   }
  // }



//*********Log_in******************************************** */
@Post('Userlogin')
async loginn(@Body() loginData: { name: string; password: string }) {
  const user = await this.adminService.loginn(loginData.name);

  if (!user) {
    return { message: 'User not found' }; 
  }

  const isPasswordValid = await bcrypt.compare(loginData.password, user.password);

  if (isPasswordValid) {
    return { message: 'Login successful' };
  } else {
    throw new Error('Invalid name or password');
  }
}


async getUserByID(id) {
  const data=await this.adminRepo.findOneBy({ id });
  console.log(data);
  if(data!==null) {
      return data;
  }
 else 
 {
  throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
 }

}


@Get('/findadmin/:id')
 
  getAdminByID(@Param('id', ParseIntPipe) id: number): any {
    return this.adminService.getUserByID(id);
  }

  @Get('/findadmin')
  getAdminByIDName(@Query() qry: any): any {
    return this.adminService.getUserByIDName(qry);
  }


  @Put('/updateadmin/')
  //@UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  updateAdminn(@Session() session,@Body('firstName') firstName: string): any {
    console.log(session.email);
    return this.adminService.updateUser(firstName, session.email);
  }


  @Delete('/deleteadmin/:id')
  deleteAdminbyid(@Param('id', ParseIntPipe) id: number): any {
    return this.adminService.getUserByID(id);
   
  }

    @Get('/getimage/:name')
    getImages(@Param('name') name, @Res() res) {
      res.sendFile(name,{ root: './uploads' })
    }
  


@Get('/searchuserby/:id')
searchUserBy(@Param('id') userID:number): Promise<AdminEntity> {
return this.adminService.getUserByID(userID);
}


@Get('/searchuserbyquery')
searchUserByQuery(@Query() myquery:object): object {
  return myquery;
}

@Get('/searchuserbyobject')
@UsePipes(new ValidationPipe())
searchUserByObject(@Body() myobject:AdminInfo): object {
  return {"name":myobject.name};
}

@Post('upload')
@UseInterceptors(FileInterceptor('myfile',
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
uploadFile(@UploadedFile() file: Express.Multer.File) {
 console.log(file);
}


  //see user profile..............
  @Get('/seeuserprofile/:name')
  async findOneByName(@Param('firstName') name: string) {
    return this.adminService.findOneByName(name);
  }


    //see approve request ..............
    @Get('/unapproved')
    async getUnapprovedUsers() {
      const unapprovedUsers = await this.adminService.getUnapprovedUsers();
      return unapprovedUsers;
    }


    ///Approved new member................

@Put('/aproved_new_member/:name')
@UsePipes(new ValidationPipe())
async approvedNewMember( @Param('name') name: string) {

      const response = await this.adminService.approvedNewMember(name);
      return response;
}



  // see customer's list................
  @Get('/customer_list')
  async customerList(){
    const show ="customer";
      const response = await this.adminService.customerList(show);
      return response;
  }


    // see customer oderlist.........
    @Post('/show_order_list/:username')
    async orderList(@Param('username') name: string): Promise<any> {
       const user = await this.adminService.orderList(name);
       return user; 
    }

      // see seller's list................
  @Get('/seller_list')
  async sellerList(){
      const show ="seller";
      const response = await this.adminService.sellerList(show);
      return response;
  }


   // search Product list by seller's name.........
   @Post('/Product_list/:username')
   async productList(@Param('username') name: string): Promise<any> {
      const user = await this.adminService.productList(name);
      return user;
     
   }

     //search user by username.........
  @Get('/showregisterduser/:username')
  async getUsers(@Param('username') name: string): Promise<any> {
      const user = await this.adminService.getUsers(name);
      return user; 
  }

  //*******Delete User */
@Delete("/delete/:name")
async deleteUser(@Param("name") name: string ): Promise<any> {
  const result = await this.adminService.deleteUser(name);
  return result;
}


//***********Update profile************ */

@Put('/update-profile/:name')
  @UsePipes(new ValidationPipe())
  async updateProfile(@Body() updateProfileDto: {
    name: string;
    password: string;
    email: string;
    nid: number;
    address: string;
    status: string;
  } ,@Param('name') name: string): Promise <any> {
    const response = await this.adminService.updateProfile(updateProfileDto, name);
    if (response === 'update_success') {
      return { message: 'update_success' };
    } else if (response === 'username_not_matched') {
      return { message: "username_not_matched" };
    }else if(!response){
      return {message :"not_update"};
    }
  }


    //*********Blocked user********** */

@Put('/blocked_user/:username')
async blockeUser(@Param('username') name: string): Promise<any> {
    const user = await this.adminService.blockeUser(name);
    return user;
}

//customer (GET)

@Get(':customerId/products')
async getProductsOfACustomer(@Param('customerId') customerId: number) {
  return this.adminService.getProductsOfACustomer(customerId);
}


@Post('logout')
logout(@Req() req: Request & { session: any }) {
req.session.destroy();
return 'Logout successful!';
}


@Post('upload')
@UseInterceptors(FileInterceptor('myfile',
{ fileFilter: (req, file, cb) => {
  if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
   cb(null, true);
  else {
   cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
   }
  },
  limits: { fileSize: 300000 },
  storage:diskStorage({
  destination: './upload',
  filename: function (req, file, cb) {
   cb(null,Date.now()+file.originalname)
  },
  })
}
  
))
  

@Post('addadmin')
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
addAdmin(@Body() adminInfo:AdminInfo, @UploadedFile()  myfile: Express.Multer.File) {
  adminInfo.filename = myfile.filename;
return this.adminService.addAdmin(adminInfo);
}

@Put('/updatebyid/:id')
@UseGuards(SessionGuard)
updateAdmin(@Param('id') id:number, @Body() adminInfo:AdminInfo)
{
  return this.adminService.updateAdmin(id,adminInfo);
}


       async sendEmail(emailData: emailDTO): Promise<void> {
        await this.mailerService.sendMail({
          to: emailData.to,
          subject: emailData.subject,
          text: emailData.text,
        });
      }
}
