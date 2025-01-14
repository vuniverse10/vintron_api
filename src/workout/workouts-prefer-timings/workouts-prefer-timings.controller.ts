import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WorkoutsPreferTimingsService } from '../services/workouts-prefer-timings.service';
import { CreateWorkoutsPreferTimingsDto } from '../dto/create-workouts-prefer-timings.dto';

@Controller('workouts-prefer-timings')
export class WorkoutsPreferTimingsController {
  constructor(private readonly timingsService: WorkoutsPreferTimingsService) {}

  @Post()
  create(@Body() createDto: CreateWorkoutsPreferTimingsDto) {
    return this.timingsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.timingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timingsService.findOne(id);
  }

  //   @Patch(':id')
  //   update(
  //     @Param('id') id: string,
  //     @Body() updateDto: CreateWorkoutsPreferTimingsDto,
  //   ) {
  //     return this.timingsService.update(id, updateDto);
  //   }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timingsService.remove(id);
  }
}
