import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from "@nestjs/common";
import { HeightService } from "../services/height.service";
import { CreateHeightDto } from "../dto/create-height.dto";
import { Height } from "../schemas/height.schema";

@Controller("heights")
export class HeightController {
  constructor(private readonly heightService: HeightService) {}

  @Post()
  create(@Body() createHeightDto: CreateHeightDto): Promise<Height> {
    return this.heightService.create(createHeightDto);
  }

  @Get()
  async findAll(): Promise<{
    code: number;
    message: string;
    data: { height: string; value: number }[];
  }> {
    return this.heightService.fetchHeights();
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<Height> {
    return this.heightService.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id") id: string,
    @Body() updateHeightDto: CreateHeightDto
  ): Promise<Height> {
    return this.heightService.update(id, updateHeightDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string): Promise<void> {
    return this.heightService.remove(id);
  }

  @Post("bulk-insert")
  async bulkInsert(
    @Body() heights: { height: string; value: number }[]
  ): Promise<any> {
    return this.heightService.bulkCreate(heights);
  }
}
