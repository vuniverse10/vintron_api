import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from "@nestjs/common";
import { HydrationService } from "../services/hydration.service";
@Controller("hydration")
export class HydrationController {
  constructor(private readonly hydrationService: HydrationService) {}

  @Get()
  getHello(): string {
    return "Welcome to the Hydration";
  }

  @Post("/waterInTakeSuggestion")
  waterInTakeSuggestion(@Body() body) {
    return this.hydrationService.waterIntakeSuggestions(body);
  }

  @Get("/measurements")
  waterMeasurements() {
    const waterIntakeList = [];
    for (let i = 100; i <= 12000; i += 100) {
      waterIntakeList.push({
        title: `${i} ML`,
        measurementValue: `${i}`,
        units: "ML",
        measurementSection: "LITERS",
      });
    }
    return {
      code: 200,
      message: "Water Measurements List",
      data: waterIntakeList,
    };
  }

  @Post("/save-water-remainder")
  saveWaterRemainder(@Body() body) {
    return this.hydrationService.saveUserWaterRemainder(body);
  }

  @Post("/fetch-water-remainder-details")
  fetchWaterRemainderDetails(@Body() body: { userID: string }) {
    return this.hydrationService.fetchWaterRemainderDetails(body.userID);
  }

  @Post("/save-water-intake")
  saveWaterIntake(@Body() body) {
    return this.hydrationService.saveWaterIntake(body);
  }

  @Post("/hydration-statistics")
  hydrationStatistics(@Body() body) {
    return this.hydrationService.fetchWaterIntakeStatistics(body);
  }

  @Post("/hydration-reports")
  hydrationReports(@Body() body: { userId: string }) {
    return this.hydrationService.fetchWaterRemainderDetails(body.userId);
  }
}
