import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Msg91Module } from "src/msg91";
import { UsersModule } from "src/users";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import configuration from "config/configuration";

@Module({
  imports: [
    Msg91Module,
    UsersModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}