import { 
  Body, 
  Controller, 
  Get, HttpCode, 
  Patch, 
  Post, 
  Request, 
  UseGuards 
} from "@nestjs/common";
import { 
  LoginRequestDto, 
  ProfileResponseDto, 
  ProfileUpdateRequestDto, 
  RegisterRequestDto, 
  VerifyOtpRequestDto, 
  VerifyOtpResponseDto 
} from "./auth.dto";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guard";

@Controller("auth")
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {}

  @Post("/login")
  @HttpCode(204)
  async login(@Body() loginRequestDto: LoginRequestDto) {
    await this.authService.login(loginRequestDto);
  }

  @Post("/register")
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    await this.authService.register(registerRequestDto);
  }

  @Post("/verify")
  async verify(@Body() verifyOtpRequestDto: VerifyOtpRequestDto) {
    const authDetails: VerifyOtpResponseDto = await this.authService.verifyOtp(verifyOtpRequestDto);
    return authDetails;
  }

  @UseGuards(AuthGuard)
  @Get("/profile")
  async getProfile(@Request() req: any): Promise<ProfileResponseDto> {
    return await this.authService.getProfile(req.user.user);
  }

  @UseGuards(AuthGuard)
  @Patch("/profile")
  async updateProfile(@Request() req: any, @Body() user: Partial<ProfileUpdateRequestDto>): Promise<ProfileResponseDto> {
    return await this.authService.updateProfile(req.user.user, user);
  }

  @Post("/logout")
  async logout() {
    return;
  }
}