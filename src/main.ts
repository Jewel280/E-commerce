import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
     session({
     secret: 'locked',
     resave: false,
     saveUninitialized: false,
    cookie:{
     maxAge: 300000
    }
     }),
    );
    
    await app.listen(3002,()=>{
      console.log('Your server is running on port:3002');
    });
}
bootstrap();
