import mongoose, { Schema } from "mongoose";
import { FoodItem,Nutrients }  from '../../interfaces/foodItems'
import { string } from "zod";

const nutrientsSchema = new Schema({
    fats: { type: Number, required: true },
    carbs: { type: Number, required: true },
    protein: { type: Number, required: true },
    calories: { type: Number, required: true },
});

const foodItemSchema = new Schema({
    food_name: { type: String, required: true },
    common_names: { type: String, required: true },
    food_unique_id: { type: String, required: true },
    food_id: { type: Number, required: true },
    serving_size: { type: String, required: true },
    serving_type: { type: String, required: true },
    calories_calculated_for: { type: Number, required: true },
    basic_unit_measure: { type: Number, required: true },
    source_link: { type: String, required: true },
    nutrients: { type: nutrientsSchema, required: true },
});

const userSavedItemsSchema = new Schema({
    userID: { type: String, required: true },
    itemWeight: { type: String, required: true },
    mealType: { type: String, required: true },
    itemQuantity: { type: Number, required: true },
    foodItem: { type: [foodItemSchema], required: true },
    orderDate: { type: Date, required: true },
    orderTime: { type: String, required: true },
    foodItemCalories: { type: Number, required: true },
    consumedCalories: { type: Number, required: true },
    createdDateTime: { type: Date, required: true, default: Date.now },
}, { timestamps: true });

const UserFoodItemsModel = mongoose.model('nutritionUserFoodItems', userSavedItemsSchema);
export default UserFoodItemsModel;