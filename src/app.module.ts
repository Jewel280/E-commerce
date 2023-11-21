import { Module } from '@nestjs/common';
import { AdminModule } from './admin/admin.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryBoyModule } from './delivery-boy/delivery-boy.module';
import { SellerModule } from './seller/seller.module';

@Module({
  imports: [AdminModule,
    TypeOrmModule.forRoot(
      { type: 'postgres',
       host: 'localhost',
       port: 3000,
       username: 'postgres',
       password: 'musa',
       database: 'admin5',
       autoLoadEntities: true,
       synchronize: true,
       } ),
      
  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
