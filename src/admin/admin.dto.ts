import { IsDefined, IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from 'class-validator'


export class AdminInfo{

    @IsString()
    @IsNotEmpty()
    firstName:string;

    @IsString() 
    @IsNotEmpty({message: "Please enter your Lastname"}) 
    lastName:string;

    @IsString() 
    @IsNotEmpty({message: "Please enter your Username"}) 
    @MinLength(3)
    @MaxLength(20)
    username:string;
    
    @IsEmail()
    @IsNotEmpty({message: "Please enter your Email Address"})
    email:string;

    @IsString() 
    @IsNotEmpty({message: "Please enter your number "})
    @MaxLength(11)
    phone:string;
    
    @IsString() 
    @IsNotEmpty({message: "Please enter your pasword "})
    password:string;
    name: string;
    filename: string;

}

export class approve_Dto{
    
    @IsNotEmpty()
    @IsString()
	approved:string;


}


export class SellerInfo{
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNotEmpty()
    @IsString()
    email: string;
    @IsNotEmpty()
    @IsNumber()
    contact: number;
}

export class UserEntity{
        
    name:string;

    @IsNotEmpty() 
    password:string;

    @IsNotEmpty() 
    email:string;

    @IsNotEmpty() 
    nid:string;

    @IsNotEmpty() 
    address:string;

    @IsNotEmpty() 
    status:string;

}

export class AdminUpdateInfo{
    name:string;
    username:string;

    @IsNotEmpty()
    password:string;

}





    
export class CustomerInfo {

        @IsString()
        @IsNotEmpty()
        name: string;

        @IsNotEmpty()
        @IsString()
        username: string;
        @IsNotEmpty()
        password: string;
        address: string;
        filename: string;
      }
      

      export class ProductInfo{

        @IsNotEmpty()
        @IsString()
        name: string;

        @IsDefined()
        @IsString()
        description: string;

        @IsNotEmpty()
        @IsNumber()
        price: number;
    }


    export class changePassword_Dto{
        @IsNotEmpty()
        oldpassword:string;
    
        @IsNotEmpty()
        newpassword:string;
    
    }

    export class emailDTO {
        @IsNotEmpty()
        to:string;
        subject:string;
    
        @IsNotEmpty()
        text:string;
      };