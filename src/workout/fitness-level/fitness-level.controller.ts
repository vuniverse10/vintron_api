import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FitnessLevelService } from '../services/fitness-level.service';
import { CreateFitnessLevelDto } from '../dto/create-fitness-level.dto';

@Controller('fitness-levels')
export class FitnessLevelController {
  constructor(private readonly fitnessLevelService: FitnessLevelService) {}

  @Post()
  async create(@Body() createFitnessLevelDto: CreateFitnessLevelDto) {
    return this.fitnessLevelService.create(createFitnessLevelDto);
  }

  @Get()
  async findAll() {
    return this.fitnessLevelService.fetchFitnessLevelList();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.fitnessLevelService.findOne(id);
  }

  //   @Put(':id')
  //   async update(
  //     @Param('id') id: string,
  //     @Body() createFitnessLevelDto: createFitnessLevelDto,
  //   ) {
  //     return this.fitnessLevelService.update(id, createFitnessLevelDto);
  //   }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.fitnessLevelService.remove(id);
  }

  @Post('bulk-insert')
  async bulkInsert(@Body() fitnessLevels: { label: string }[]): Promise<any> {
    return this.fitnessLevelService.bulkCreate(fitnessLevels);
  }
}
