import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { FastingService } from "../services/fasting.service";
import { UserFastingRequestDto } from "../dto/user-fasting-request.dto";
import { UserFastingRequest } from "../schemas/user-fasting-request.schema";

@Controller("fasting")
export class FastingController {
  constructor(private readonly fastingService: FastingService) {}

  @Post("/save-fasting-plan-request")
  async SaveUserPlanRequest(
    @Body() userFastingRequestDto: UserFastingRequestDto
  ): Promise<UserFastingRequest> {
    return this.fastingService.createUserFastingPlan(userFastingRequestDto);
  }

  @Post("/user-day-based-fasting-data")
  async getUserDayBaseFastingData(@Body() body): Promise<any> {
    return this.fastingService.fetchUserDayBasedFastingDetails(body);
  }

  @Post("/change-fasting-complete-status")
  async changeFastingCompleteStatus(
    @Body()
    body: {
      fastingPlanID: string;
      isCompleted: boolean;
      userID: string;
    }
  ): Promise<any> {
    return this.fastingService.changeFastingCompleteStatus(body);
  }

  @Get("/fetch-user-latest-fasting-data/:userID")
  fetchUserLastFastingData(@Param("userID") userID: string): Promise<any> {
    return this.fastingService.fetchUserLastFastingData(userID);
  }

  @Put("/update-fasting-plan/:userID/:fastingPlanID")
  async updateFastingPlan(
    @Param("userID") userID: string,
    @Param("fastingPlanID") fastingPlanID: string,
    @Body() updateData: any
  ): Promise<any> {
    return this.fastingService.updateFastingPlan(
      userID,
      fastingPlanID,
      updateData
    );
  }
}
