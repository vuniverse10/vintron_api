import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { NutritionController } from "./nutrition/nutrition/nutrition.controller";
import { MealTypesController } from "./meal-types/meal-types.controller";
import { NutritionService } from "./services/nutrition.service";
import { UserDayBasedCaloriesSetupSchema } from "./schema/userDayBasedCaloriesSetup.schema";
import { FoodItems, FoodItemsSchema } from "./schema/food.schema";
import {
  UserNutritionHistory,
  UserNutritionHistorySchema,
} from "./schema/userNutritionHistory.schema";
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "UserDayBasedCaloriesSetup",
        schema: UserDayBasedCaloriesSetupSchema,
      },
      {
        name: "FoodItems",
        schema: FoodItemsSchema,
      },
      {
        name: "UserNutritionHistory",
        schema: UserNutritionHistorySchema,
      },
    ]),
  ],
  providers: [NutritionService],
  controllers: [NutritionController, MealTypesController],
})
export class NutritionModule {}
