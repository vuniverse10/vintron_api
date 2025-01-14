import { Module } from "@nestjs/common";
import { UserRepository } from "./repository/user.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { UsersService } from "./users.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { 
        name: User.name, 
        schema: UserSchema 
      }
    ])
  ],
  providers: [UserRepository, UsersService],
  exports: [UsersService]
})
export class UsersModule {}