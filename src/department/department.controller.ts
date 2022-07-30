import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
} from '@nestjs/common';
import { HttpResponse } from 'src/constans/httpResponse';
import { Department } from 'src/entities';
import { DepartmentService } from './department.service';

const url = 'department';
interface AssignCourse {
  departmentId: string;
  courseId: string;
}

@Controller()
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(url)
  async create(@Body() newDepartment: Department): Promise<HttpResponse> {
    return await this.departmentService.create(newDepartment);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(url)
  async findAll(): Promise<HttpResponse> {
    return await this.departmentService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`${url}/:id`)
  async findOne(@Param('id') id: string): Promise<HttpResponse> {
    return await this.departmentService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(`${url}/:id`)
  async update(
    @Param('id') id: string,
    @Body() newDepartment: Department,
  ): Promise<HttpResponse> {
    return await this.departmentService.update(id, newDepartment);
  }

  @Delete(`${url}/:id`)
  async remove(@Param('id') id: string): Promise<HttpResponse> {
    return await this.departmentService.remove(id);
  }

  //course
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`${url}_course`)
  async assignCourse(@Body() data: AssignCourse): Promise<HttpResponse> {
    return await this.departmentService.assignCourse(
      data.departmentId,
      data.courseId,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(`${url}_course`)
  async unAssignCourse(@Body() data: AssignCourse): Promise<HttpResponse> {
    return await this.departmentService.unAssignCourse(
      data.departmentId,
      data.courseId,
    );
  }
}
