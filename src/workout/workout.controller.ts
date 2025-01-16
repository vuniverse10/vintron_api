// src/workout/workout.controller.ts
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
import { WorkoutService } from "./workout.service";
import { CreatePersonalTrainingServiceDto } from "./dto/create-personal-training.service.dto";
import { CreateFitnessLevelDto } from "./dto/create-fitness-level.dto";
import { CreateBodyFocusAreaDto } from "./dto/create-body-focus-area.dto";
import { CreateWorkoutPreferDto } from "./dto/create-workout-prefer.dto";
import { CreateWorkoutTimingDto } from "./dto/create-workout-timing.dto";
import { CreateWorkoutPlanWeekDto } from "./dto/create-workout-plan-week.dto";
import { CreateWorkoutDurationDto } from "./dto/create-workout-duration.dto";
import { Workout } from "../excel-import/workout.schema";

@Controller("workouts")
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Get("search-workouts")
  async getWorkouts(@Query() filters: any): Promise<Workout[]> {
    return this.workoutService.searchWorkOuts(filters);
  }

  @Post("age-calculator")
  ageCalculator(@Body() body: { dob: string }) {
    const dob = new Date(body.dob);
    const age = this.calculateAge(dob);
    return age;
  }

  private calculateAge(dob: Date): { age: string | number; dob: Date } {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    if (
      month < dob.getMonth() ||
      (month === dob.getMonth() && day < dob.getDate())
    ) {
      age--;
    }

    return {
      age: Number(age),
      dob: dob,
    };
  }

  @Get("workouts-sections")
  async fetchWorkoutSections(): Promise<any> {
    return this.workoutService.fetchAllWorkoutSections();
  }

  @Post("user-suggested-categories")
  userSuggestedWorkoutCategories(@Body() body) {
    return this.workoutService.userSuggestibleWorkoutCategories(body);
  }

  @Post("category-based-unique-exercises")
  categoryBasedUniqueExercises(@Body() body) {
    return this.workoutService.categoryBasedUniqueExerciseList(body);
  }

  @Post("category-based-exercises")
  categoryBasedExercises(@Body() body) {
    return this.workoutService.categoryBasedExerciseList(body);
  }

  @Get("fetch-all-workouts")
  async fetchAllWorkouts(): Promise<any> {
    return this.workoutService.fetchAllWorkouts();
  }
}
