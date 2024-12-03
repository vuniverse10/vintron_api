import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import { feetToCms } from "../../utils/index";
const waterSuggestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { height, weight, age, gender, activityLevel = 1.5 } = req.body;

    if (!weight || isNaN(weight) || weight <= 0) {
      return res.status(400).json({
        error: "Invalid weight. Please provide a valid weight in kilograms.",
      });
    }

    if (!height) {
      return res.status(400).json({
        error: "Invalid height. Please provide a valid height.",
      });
    }
    let userHeight = 0;
    if (height) {
      userHeight = feetToCms(height);
      if (isNaN(userHeight) || userHeight <= 0) {
        return res.status(400).json({
          status: 400,
          message: "Invalid height. Please provide a valid height in feet.",
        });
      }
    }

    //   water intake based on weight (30 mL per kg)
    let waterIntake = weight * 30;

    const inputGender = gender.toLowerCase();
    if (inputGender === "male") {
      waterIntake *= 1.1; // 10% more for males
    } else if (inputGender === "female") {
      waterIntake *= 0.9; // 10% less for females
    }

    // Adjust for activity level (e.g., moderately active = 1.5 multiplier)
    waterIntake *= activityLevel;

    // Optional: Adjust for age (kids and elderly people might need more)
    if (age < 18) {
      waterIntake *= 1.2; // Increase for children
    } else if (age > 65) {
      waterIntake *= 1.2; // Increase for elderly
    }
    const recemendedWaterIntake = Math.round(waterIntake);
    // Return the calculated water intake in milliliters
    return res.status(200).json({
      code: 200,
      message: "Water intake calculated successfully",
      data: {
        weight_kg: Number(weight),
        height_cm: userHeight,
        gender: gender,
        age: Number(age),
        activity_level: activityLevel,
        recommended_water_intake_ml: recemendedWaterIntake,
        recommended_water_intake_liter: recemendedWaterIntake / 1000,
      },
    });
  } catch (error) {
    console.error("Error calculating water intake:", error);
    return next(error);
  }
};

export default { waterSuggestion };
