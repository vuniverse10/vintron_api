import { IsNotEmpty, IsNumber } from "class-validator";

export class UserNutritionHistoryDto {
  @IsNotEmpty()
  userID: string;
  itemWeight: number;
  mealType: string;
  itemQuantity: number;
  foodItem: string[];
  orderDate: Date;
  orderTime: string;
}
