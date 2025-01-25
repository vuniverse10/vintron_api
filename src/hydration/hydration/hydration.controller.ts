import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
  BadRequestException,
} from "@nestjs/common";
import { HydrationService } from "../services/hydration.service";
import * as moment from "moment";

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

  @Get("/time-measurements")
  timeMeasurements() {
    const timeMeasurementsList = [
      {
        title: "1 Hour",
        value: 60,
      },
      {
        title: "2 Hours",
        value: 120,
      },
      {
        title: "3 Hours",
        value: 180,
      },
      {
        title: "4 Hours",
        value: 240,
      },
      {
        title: "5 Hours",
        value: 300,
      },
      {
        title: "6 Hours",
        value: 360,
      },
      {
        title: "7 Hours",
        value: 420,
      },
      {
        title: "8 Hours",
        value: 480,
      },
      {
        title: "9 Hours",
        value: 540,
      },
      {
        title: "10 Hours",
        value: 600,
      },
      {
        title: "11 Hours",
        value: 660,
      },
      {
        title: "12 Hours",
        value: 720,
      },
      {
        title: "13 Hours",
        value: 780,
      },
      {
        title: "14 Hours",
        value: 840,
      },
      {
        title: "15 Hours",
        value: 900,
      },
      {
        title: "16 Hours",
        value: 960,
      },
      {
        title: "17 Hours",
        value: 1020,
      },
      {
        title: "18 Hours",
        value: 1080,
      },
      {
        title: "19 Hours",
        value: 1140,
      },
      {
        title: "20 Hours",
        value: 1200,
      },
      {
        title: "21 Hours",
        value: 1260,
      },
      {
        title: "22 Hours",
        value: 1320,
      },
      {
        title: "23 Hours",
        value: 1380,
      },
      {
        title: "24 Hours",
        value: 1440,
      },
    ];

    return {
      code: 200,
      message: "Time Measurements List",
      data: timeMeasurementsList,
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

  @Get("/yearly-water-intake/:userID")
  async getYearlyWaterIntake(@Param("userID") userID: string) {
    if (!userID) {
      return {
        code: 400,
        message: "UserID is required",
      };
    }
    return this.hydrationService.getYearlyWaterIntake(userID);
  }

  @Get("/monthly-water-intake/:userID")
  async getMonthlyWaterIntake(@Param("userID") userID: string) {
    if (!userID) {
      throw new BadRequestException("User ID is required.");
    }
    return this.hydrationService.getMonthlyWaterIntake(userID);
  }

  @Get("/daily-water-intake/:userID")
  async getDailyWaterIntake(@Param("userID") userID: string) {
    if (!userID) {
      throw new BadRequestException("User ID is required.");
    }
    return this.hydrationService.getDailyWaterIntake(userID);
  }

  @Get("/weekly-water-intake/:userID")
  async getWeeklyWaterIntake(@Param("userID") userID: string) {
    if (!userID) {
      throw new BadRequestException("User ID is required.");
    }
    return this.hydrationService.getThisWeekWaterIntake(userID);
  }
}
