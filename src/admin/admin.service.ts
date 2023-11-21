import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity, CustomerEntity, SellerEntity, UserEntity, productEntity } from './admin.entity';
import { Repository } from 'typeorm';
import { AdminInfo, changePassword_Dto } from './admin.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(AdminEntity) 
    private adminRepo: Repository<AdminEntity>,
    @InjectRepository(UserEntity)
    private userRepo:
    Repository<UserEntity>,
    @InjectRepository(CustomerEntity)
    private customerRepo:
    Repository<CustomerEntity>,
    @InjectRepository(productEntity)
    private proRepo:
    Repository<productEntity>,
    @InjectRepository(SellerEntity)
    private sellerRepo:
    Repository<SellerEntity>){}
    private readonly mailerService: MailerService
    changePassword(changePassword_dto: changePassword_Dto, name: any) {
      throw new Error("Method not implemented.");
    }
  
//registration user....
async registrationuser(registration_dtoo: any) {
  const User = await this.userRepo.findOne({ where: { name: registration_dtoo.name } });

  if (User) {
    
    return 'User exist';
  } else {

    const newUser = new UserEntity();
    newUser.name = registration_dtoo.name;
    newUser.password = registration_dtoo.password; 
    newUser.email = registration_dtoo.email;
    newUser.nid = registration_dtoo.nid;
    newUser.address = registration_dtoo.address;
    newUser.status = registration_dtoo.status;
    newUser.approval = "null";

    const hashedPassword = await bcrypt.hash(registration_dtoo.password, 10);
    newUser.password = hashedPassword;

   const savedUser = await this.userRepo.save(newUser);

   return "User added Successfull";
  }
}

//login.....
async loginn(name: string): Promise<UserEntity | null> {
return this.userRepo.findOne({ where: { name } });
}

  
  async signupadmin(adminn: AdminInfo) {
    const admin = await this.adminRepo.findOne({ where: { username: adminn.username } });
  
    if (admin) {
      return 'Admin exist';
    } else {
      const newAdmin = new AdminEntity();
      newAdmin.firstName = adminn.firstName;
      newAdmin.lastName = adminn.lastName;
      newAdmin.username = adminn.username;
      newAdmin.password = adminn.password; 
      newAdmin.email = adminn.email;
      newAdmin.phone = adminn.phone;
  
      const hashedPassword = await bcrypt.hash(adminn.password, 10);
      newAdmin.password = hashedPassword;
  
      await this.adminRepo.save(newAdmin);
  
      return 'Admin added successfully';
    }
  }
  async loginnn(username: string): Promise<AdminEntity | null> {
    return this.adminRepo.findOne({ where: { username } });
  }





  // getAll(): Promise<AdminEntity[]> {
  //   return this.adminRepo.find(
  //     {
  //       select:{
  //         name: true,
  //         username: true
        
  //       }
        
  //     }
  //   );
  // }

  async getUserByID(id: number): Promise<any> {
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


  getUserByIDName(qry: any): any {
    return this.adminRepo.findOneBy({ id:qry.id,firstName:qry.firstName });
  }

updateUser(firstName: string, email: string): any {
  return this.adminRepo.update(email, { firstName }); // Assuming email is the primary key
}


 async addAdmin(adminInfo:AdminInfo):Promise<AdminEntity[]>
  {
    const password = adminInfo.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    adminInfo.password = hashedPassword;
   const res = await this.adminRepo.save(adminInfo);
   return this.adminRepo.find();
  }

  updateAdmin(id:number, adminInfo:AdminInfo):Promise<AdminEntity>
  {
   const res=  this.adminRepo.update(id,adminInfo);

     return this.adminRepo.findOneBy({id});
  }

        ///see profile................
        async findOneByName(name: string) {
          return this.userRepo.findOneBy({ name });
        }


              ///see unapproved member................
      async getUnapprovedUsers(): Promise<UserEntity[]> {
        const unapprovedUsers = await this.userRepo.find({
          where: [{ approval: "null" }, { approval: "Blocked" }],
        });
        return unapprovedUsers;
      }


            //*************Approved new member************* */
            async approvedNewMember( name: string): Promise<string> {
              const regUser = await this.userRepo.findOne({ where: { name } });
          
              if (!regUser) {
                return ('User_not_found');
              }
          
              regUser.approval = "approved";
          
              try {
                await this.userRepo.createQueryBuilder()
                  .update(UserEntity)
                  .set({ approval: regUser.approval })
                  .where('name = :name', { name })
                  .execute();
          
                return ('Approved_success');
              }catch (error) {
                throw new Error('User Not Found.');
              }
            }
    ///******************show customer List************* */
            async customerList(show:string):Promise<any>{
              const users = await this.userRepo.find({ where: { status: show } });
              return users;
            }

            
//*************see customer order list............*/
            async orderList(name: string): Promise<any> {
              const orderList = await this.customerRepo.find({ where: { name: name } });
              if(!orderList){
                 return ("Customer has no oder list");
              }
              return orderList;
            
            }

             ///******************show Seller List************* */
 async sellerList(show:string):Promise<any>{
  const users = await this.userRepo.find({ where: { status: show } });
  if (users !== null) {
    return users;
  }

  return ("No Seller Found");

}


//*************show product list............*/

async productList(name: string): Promise<any> {
  const productList = await this.sellerRepo.find({ where: { name: name } });
  if (!productList) {
    return ("No Seller Found");
  }

  return productList;

}

///search user by name.....
async getUsers(name: string): Promise<any> {
  const user = await this.userRepo.findOne({ where: { name: name } });

  if (user) {
    if(user.status==="seller" || user.status==="customer"){
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
  } else {
    return ("User not Found");
  }
}

    //delete user............
    async deleteUser(name: string): Promise<string> {
      const user = await this.userRepo.findOne({ where: { name } });
    
      if (user) {
        try {
          await this.userRepo.remove(user);
          return "User deleted successfully";
        } catch (error) {
          return "User could not be deleted";
        }
      } else {
        return "User not found";
      }
    }

    //update user profile by admin.....
    async updateProfile(updateProfileDto: any, name: string): Promise<string> {
      const regUser = await this.userRepo.findOne({ where: { name } });
    
      if (!regUser) {
        return 'user_not_found';
      }
    
      if (updateProfileDto.name === regUser.name) {
        const hashedPassword = await bcrypt.hash(updateProfileDto.password, 10);
        regUser.name = updateProfileDto.name;
        regUser.email = updateProfileDto.email;
        regUser.nid = updateProfileDto.nid;
        regUser.address = updateProfileDto.address;
        regUser.status = updateProfileDto.status;
        regUser.password = hashedPassword; // Set the hashed password
        await this.userRepo.update({ name }, regUser);
        return 'update_success';
      } else {
        return 'username_not_matched';
      }
    }

        //*********************Blocked User************* */
        async blockeUser(name: string): Promise<any> {
          const user = await this.userRepo.findOne({ where: { name: name } });
        
          if (!user) {
            return 'User not exists!';
          }
            user.approval="Blocked";
            try {
              await this.userRepo.createQueryBuilder()
                .update(UserEntity)
                .set({ approval: user.approval })
                .where('name = :name', { name })
                .execute();
        
              return 'User_Blocked!';
            
          }catch(error){
            return "User Not Blocked!";
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
    

}
