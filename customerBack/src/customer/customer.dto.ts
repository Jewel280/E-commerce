import {IsNotEmpty,IsDefined, IsNumber,IsInt,IsString } from 'class-validator'


export class CustomerInfo {
    id: number;
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsString()
    username: string;
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

export class wishlistInfo{
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsString()
    description: string;
    @IsNotEmpty()
    @IsNumber()
    price: number;
}

export class CartInfo{
    @IsString()
    @IsNotEmpty()
    name: string;
    @IsNumber()
    @IsNotEmpty()
    price: number;
    @IsInt()
    @IsNotEmpty()
    quantity: number;
    @IsNumber()
    @IsNotEmpty()
    total: number;
}


export class OrderedDTO {
    @IsNotEmpty()
    @IsString()
    name: string;
    @IsNumber()
    @IsNotEmpty()
    price: number;
    @IsInt()
    @IsNotEmpty()
    quantity: number;
    @IsNumber()
    @IsNotEmpty()
    total: number;
  }

  export class LoginDto {
    @IsNotEmpty({ message: 'Username cannot be empty' })
    @IsString({ message: 'Username must be a string' })
    username: string;
  
    @IsNotEmpty({ message: 'Password cannot be empty' })
    @IsString({ message: 'Password must be a string' })
    password: string;
  }

  export class emailDTO {
    @IsNotEmpty()
    to:string;
    subject:string;

    @IsNotEmpty()
    text:string;
  };
  