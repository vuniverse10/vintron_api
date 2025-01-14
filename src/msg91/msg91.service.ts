import { HttpService } from "@nestjs/axios";
import axios, {
  AxiosResponse 
} from "axios";
import { 
  Injectable, 
  InternalServerErrorException} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Msg91ResponseDto } from "./msg91.dto";
import { 
  ErrorCode, 
  ErrorDefinition, 
  ErrorDefinitions, 
  ErrorMessageToCode, 
} from "src/common";
import { 
  Msg91InternalServerException, 
  Msg91InvalidOtpException, 
  Msg91OtpExpiryException 
} from "./msg91.exceptions";

// TODO: Update to properly handle the error response from the Msg91 API
@Injectable()
export class Msg91Service {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService
  ) {}

  async sendOtp(mobileNumber: string): Promise<void> {
    try {
      const url = this.getSendOtpUrl(mobileNumber);
      const response: AxiosResponse<Msg91ResponseDto> = await this.httpService.axiosRef.post(url);
      
      if(response.data.type === "error") {
        const errorDefinition: ErrorDefinition = ErrorDefinitions[ErrorCode[response.data.message]];
        throw new Msg91InternalServerException(errorDefinition);
      }
    } catch (error) {
      this.handleAxiosError(error);
    }
  }

  async verifyOtp(mobileNumber: string, otp: number): Promise<void> {
    try {
      const authKey = this.configService.get<string>("msg91.authKey");
      const url = this.getVerifyOtpUrl(mobileNumber, otp);
      const response: AxiosResponse<Msg91ResponseDto> = await this.httpService.axiosRef.get(url, {
        headers: {
          "authKey": authKey
        }
      });

      console.log("response", response.data);

      if(response.data.type === "error") {
        this.handleVerifyOtpErrorResponse(response);
      }
    } catch (error) {
      throw new InternalServerErrorException("Failed to verify OTP");
    }
  }

  private getSendOtpUrl(mobileNumber: string) {
    const authKey = this.configService.get<string>("msg91.authKey");
    const templateId = this.configService.get<string>("msg91.templateId");
    const sendOtpUrl = this.configService.get<string>("msg91.sendOtpUrl");
    const otpExpiry = this.configService.get<string>("msg91.otpExpiryInMinutes");

    const params = new URLSearchParams({
      otp_expiry: otpExpiry,
      template_id: templateId,
      mobile: mobileNumber,
      authkey: authKey,
    });

    return `${sendOtpUrl}?${params.toString()}`;
  }

  private getVerifyOtpUrl(mobileNumber: string, otp: number) {
    const verifyOtpUrl = this.configService.get<string>("msg91.verifyOtpUrl");

    const params = new URLSearchParams({
      otp: otp.toString(),
      mobile: mobileNumber,
    });

    return `${verifyOtpUrl}?${params.toString()}`;
  }

  private handleVerifyOtpErrorResponse(response: AxiosResponse<Msg91ResponseDto>): void {
    if (response.data.type === 'error') {
      const errorCode = ErrorMessageToCode[response.data.message];
      const errorDefinition: ErrorDefinition = ErrorDefinitions[errorCode];

      switch (errorCode) {
        case ErrorCode.MSG91_OTP_EXPIRED:
          throw new Msg91OtpExpiryException(errorDefinition);
        case ErrorCode.MSG91_OTP_INVALID:
          throw new Msg91InvalidOtpException(errorDefinition);
        default:
          throw new Msg91InternalServerException(errorDefinition);
      }
    }
  }

  private handleAxiosError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      
      const errorMessage = error.response.data.message;
      const errorCode = ErrorCode[errorMessage];
      const errorDefinition: ErrorDefinition =
        ErrorDefinitions[errorCode];
      throw new Msg91InternalServerException(errorDefinition);
    } else {
      throw new InternalServerErrorException("Internal Server Error");
    }
  }
}