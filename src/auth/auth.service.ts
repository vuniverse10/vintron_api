import { 
  ConflictException, 
  Injectable, 
  InternalServerErrorException, 
  UnauthorizedException 
} from "@nestjs/common";
import { Msg91Service } from "src/msg91";
import { UsersService } from "src/users/users.service";
import { 
  LoginRequestDto, 
  ProfileResponseDto, 
  RegisterRequestDto, 
  ResendOtpRequestDto, 
  VerifyOtpRequestDto, 
  VerifyOtpResponseDto 
} from "./auth.dto";
import { JwtService } from "@nestjs/jwt";
import { plainToInstance } from "class-transformer";

// TODO: Update Propert Error Handleing
@Injectable()
export class AuthService {
  constructor(
    private readonly msg91Service: Msg91Service,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login(loginRequestDto: LoginRequestDto) {
    const user = await this.usersService.findByMobileNumber(loginRequestDto.mobileNumber);

    if (!user) {
      throw new UnauthorizedException("Invalid mobile number");
    }

    await this.msg91Service.sendOtp(loginRequestDto.mobileNumber);
  }

  async register(registerRequestDto: RegisterRequestDto) {
    const user = await this.usersService.findByMobileNumber(registerRequestDto.mobileNumber);

    if(user) {
      throw new ConflictException("A user with this mobile number already exists.");
    }

    await this.msg91Service.sendOtp(registerRequestDto.mobileNumber);
  }

  async resendOtp(resendOtpRequestDto: ResendOtpRequestDto) {
    await this.msg91Service.sendOtp(resendOtpRequestDto.mobileNumber);
  }

  async verifyOtp(verifyOtpRequestDto: VerifyOtpRequestDto): Promise<VerifyOtpResponseDto> {
    await this.msg91Service.verifyOtp(verifyOtpRequestDto.mobileNumber, verifyOtpRequestDto.otp);

    try {
      if(verifyOtpRequestDto.newRegistration) {
        const user = await this.usersService.create(verifyOtpRequestDto.mobileNumber);
        const accessToken = this.jwtService.sign({ user: user._id });
        return { accessToken };
      } else {
        const user = await this.usersService.findByMobileNumber(verifyOtpRequestDto.mobileNumber);
        const accessToken = this.jwtService.sign({ user: user._id });
        return { accessToken };
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to verify user");
    }
  }

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await this.usersService.getUserById(userId);

    if(!user) {
      throw new UnauthorizedException("User not found");
    }

    return plainToInstance(ProfileResponseDto, user.toObject());
  }

  async updateProfile(userId: string, profileResponseDto: Partial<ProfileResponseDto>): Promise<ProfileResponseDto> {
    const user = await this.usersService.getUserById(userId);

    if(!user) {
      throw new UnauthorizedException("User not found");
    }

    return await this.usersService.updateUser(userId, profileResponseDto);
  }

  async logout() {
    
  }
}