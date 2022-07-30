import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { HttpResponse } from 'src/constans/httpResponse';
import { Course } from 'src/entities';
import { CourseService } from './course.service';

const url = 'course';

@Controller()
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(url)
  async create(@Body() newCourse): Promise<HttpResponse> {
    return await this.courseService.create(newCourse);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(url)
  async findAll(): Promise<HttpResponse> {
    return await this.courseService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`${url}/:id`)
  async findOne(@Param('id') id: string): Promise<HttpResponse> {
    return await this.courseService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(`${url}/:id`)
  async update(
    @Param('id') id: string,
    @Body() newCourse: Course,
  ): Promise<HttpResponse> {
    return await this.courseService.update(id, newCourse);
  }

  @Delete(`${url}/:id`)
  async remove(@Param('id') id: string) {
    return await this.courseService.remove(id);
  }
}
