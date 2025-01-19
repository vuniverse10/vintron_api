import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { UserWorkoutService } from "../services/user-workout.services";
import { UserWorkoutDTO } from "../dto/create-user-workout.dto";
import { UserWorkout } from "../schemas/user-workout.schema";
import { UserWorkoutWeeklyPlanService } from "../services/user-workouts/user-workout-weekly-plan-exercises.services";
@Controller("user-workouts")
export class UserWorkoutsController {
  constructor(
    private readonly userWorkoutService: UserWorkoutService,
    private userWorkoutWeeklyPlanService: UserWorkoutWeeklyPlanService
  ) {}

  @Post()
  create(@Body() UserWorkoutDTO: UserWorkoutDTO): Promise<UserWorkout> {
    return this.userWorkoutService.create(UserWorkoutDTO);
  }

  @Get()
  findAll(): Promise<UserWorkout[]> {
    return this.userWorkoutService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<any> {
    return this.userWorkoutService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() UserWorkoutDTO: UserWorkoutDTO
  ): Promise<UserWorkout> {
    return this.userWorkoutService.update(id, UserWorkoutDTO);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.userWorkoutService.remove(id);
  }

  @Post("user-workout-weekly-workouts")
  getUserWeeklyWorkouts(@Body() body): Promise<any> {
    console.log(body);
    const payLoad = {
      userID: body.userID,
      userWorkoutReferenceKey: body.userWorkoutsID,
    };
    return this.userWorkoutWeeklyPlanService.fetchWorkoutWeeklyPlan(payLoad);
  }
}
