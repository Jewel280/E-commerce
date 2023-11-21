import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity, CustomerEntity, SellerEntity, UserEntity, productEntity } from './admin.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AdminEntity,productEntity,CustomerEntity,SellerEntity,UserEntity])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
