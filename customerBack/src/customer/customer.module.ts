import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity, CartEntity, productEntity, sellerEntity, wishlistEntity, OrderedEntity } from './customer.entity';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerEntity, productEntity, sellerEntity, wishlistEntity, CartEntity, OrderedEntity]),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: 'zarifthemc@gmail.com',
          pass: 'jwpl fogt xfhh qeci',
        },
      },
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
