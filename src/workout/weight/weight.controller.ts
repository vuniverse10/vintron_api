import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { WeightService } from "../services/weight.service";
import { CreateWeightDto } from "../dto/create-weight.dto";
import { Weight } from "../schemas/weight.schema";

@Controller("weights")
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post()
  create(@Body() createWeightDto: CreateWeightDto): Promise<Weight> {
    return this.weightService.create(createWeightDto);
  }

  @Get()
  async findAll(): Promise<{
    code: number;
    message: string;
    data: { kg: number; lbs: number }[];
  }> {
    return this.weightService.fetchWeights();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<Weight> {
    return this.weightService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateWeightDto: CreateWeightDto
  ): Promise<Weight> {
    return this.weightService.update(id, updateWeightDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.weightService.remove(id);
  }

  @Post("bulk-insert")
  async bulkInsert(
    @Body() weights: { kg: number; lbs: number }[]
  ): Promise<any> {
    return this.weightService.bulkCreate(weights);
  }
}
