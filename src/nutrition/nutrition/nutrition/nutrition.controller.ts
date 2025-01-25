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
import { NutritionService } from "src/nutrition/services/nutrition.service";
import { UserDayBasedCaloriesSetupsDto } from "src/nutrition/dto/userDayBasedCaloriesSetup.dto";
import { UserNutritionHistoryDto } from "src/nutrition/dto/userNutritionHistory.dto";
@Controller("nutrition")
export class NutritionController {
  constructor(private readonly nutritionService: NutritionService) {}
  @Get()
  defaultPage() {
    return {
      code: 200,
      message: "Nutrition-🥦-Section",
      data: null,
    };
  }

  @Post("/user-calories-statistics")
  userCaloriesStatistics(@Body() body) {
    return {
      code: 200,
      message: "User calories statistics",
      data: {
        caloriesBurned: `1000 Kcal`,
        caloriesConsumed: `859 Kcal`,
        caloriesDeflect: `1000 Kcal`,
      },
    };
  }

  @Get("/calories-list")
  CaloriesList() {
    const caloriesList = [];
    for (let i = 100; i <= 10000; i += 100) {
      caloriesList.push({
        title: `${i} Kcal`,
        measurementValue: `${i}`,
        units: "Kcal",
      });
    }
    return {
      code: 200,
      message: "Calories List",
      data: caloriesList,
    };
  }

  @Post("/set-user-nutrition-goal")
  setUserNutritionData(
    @Body() UserDayBasedCaloriesSetupsDto: UserDayBasedCaloriesSetupsDto
  ) {
    return this.nutritionService.saveUserDayBasedCaloriesSetup(
      UserDayBasedCaloriesSetupsDto
    );
  }

  @Get("/meal-list")
  MealList() {
    const mealTypeList = [
      {
        id: 1,
        icon: "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
        title: "Breakfast",
        description: "",
        userTotalCalories: "482 Kcal",
        timings: "06:00 AM to 11:00 AM",
      },
      {
        id: 2,
        icon: "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
        title: "Lunch",
        description: "",
        userTotalCalories: "675 Kcal",
        timings: "12:00 PM to 3:00 PM",
      },
      {
        id: 3,
        icon: "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
        title: "Dinner",
        description: "",
        userTotalCalories: "675 Kcal",
        timings: "04:00 PM to 11:00 PM",
      },
      {
        id: 4,
        icon: "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
        title: "Snack",
        description: "",
        userTotalCalories: "96 Kcal",
        timings: "04:00 PM to 06:00 PM",
      },
      {
        id: 4,
        icon: "https://vintron-storage.blr1.cdn.digitaloceanspaces.com/thumbnails/pexels-arturo-albarran-1951361020-30191517.jpg",
        title: "Beverages",
        description: "",
        userTotalCalories: "96 Kcal",
        timings: "Any",
      },
    ];

    return {
      code: 200,
      message: "Meals Type List",
      data: mealTypeList,
      description: "",
    };
  }

  @Get("/nutrition-search")
  searchNutrition(@Query("searchTerm") searchTerm: string) {
    return this.nutritionService.searchNutrition(searchTerm);
  }

  @Post("/save-nutrition-item")
  SaveNutritionItem(@Body() body) {
    return this.nutritionService.saveUserNutritionHistory(body);
  }

  @Post("/update-nutrition-item-by-user")
  UpdateUserNutrition(@Body() body) {
    return this.nutritionService.updateUserNutritionHistory(body);
  }

  @Post("/user-nutrition-filters")
  UserNutritionFilters(@Body() body) {
    return this.nutritionService.userBasedNutritionFilters(body);
  }

  @Post("/favorite-items")
  userFavoriteItems(@Body() body) {
    return this.nutritionService.userFavoriteItems(body);
  }

  @Post("/day-based-nutrition-data")
  userDayBasedNutritionData(@Body() body) {
    return this.nutritionService.userDayBasedNutritionData(body);
  }

  @Post("/user-day-based-target-data")
  UserDayBasedTargetDetails(@Body() body) {
    return this.nutritionService.UserDayBasedTargetData(body);
  }

  @Post("/summary-data")
  UserBasedSummaryData(@Body() body) {
    return this.nutritionService.userBasedSummaryData(body);
  }
}
