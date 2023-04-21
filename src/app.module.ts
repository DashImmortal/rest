import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {MongooseModule} from "@nestjs/mongoose";
import {UserController} from "./user/user.controller";
import {UserService} from "./user/user.service";
import {User, UserSchema} from "./user/user.schema";

@Module({
  imports: [MongooseModule.forRoot('mongodb://127.0.0.1:27017/payever'),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
