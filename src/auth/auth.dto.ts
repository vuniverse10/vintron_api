import { IsMobilePhone, IsOptional } from "class-validator";
import { User } from "src/users";

export class AuthBaseRequestDto {
  @IsMobilePhone("en-IN")
  mobileNumber: string;
}

export class LoginRequestDto extends AuthBaseRequestDto {}

export class RegisterRequestDto extends AuthBaseRequestDto {}

export class ResendOtpRequestDto extends AuthBaseRequestDto {}

export class VerifyOtpRequestDto {
  @IsMobilePhone("en-IN")
  mobileNumber: string;

  otp: number;

  @IsOptional()
  newRegistration?: boolean;
}

export class VerifyOtpResponseDto {
  accessToken: string;
}

export class ProfileResponseDto extends User {}
export class ProfileUpdateRequestDto extends User {}