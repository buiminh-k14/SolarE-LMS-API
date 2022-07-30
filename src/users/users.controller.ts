import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { HttpResponse } from 'src/constans/httpResponse';
import { HttpMessage } from 'src/constans/httpMessage';
import { User } from 'src/entities';

const url = 'user';
interface AssignCourse {
  userId: string;
  courseId: string;
}

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(url)
  async create(@Body() newUser): Promise<HttpResponse> {
    const user = await this.usersService.create(newUser);
    return HttpResponse(user, HttpMessage.CREATED_USER, HttpStatus.CREATED);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(url)
  async findAll(): Promise<HttpResponse> {
    return await this.usersService.findAll();
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(`${url}/:id`)
  async findOne(@Param('id') id: string): Promise<HttpResponse> {
    return await this.usersService.findOne(id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(`${url}/:id`)
  async update(
    @Param('id') id: string,
    @Body() newUser: User,
  ): Promise<HttpResponse> {
    return await this.usersService.update(id, newUser);
  }

  @Delete(`${url}/:id`)
  async remove(@Param('id') id: string): Promise<HttpResponse> {
    return await this.usersService.remove(id);
  }

  // course
  @UseInterceptors(ClassSerializerInterceptor)
  @Post(`${url}_course`)
  async assignCourse(@Body() data: AssignCourse): Promise<HttpResponse> {
    return await this.usersService.assignCourse(data.userId, data.courseId);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(`${url}_course`)
  async unAssignCourse(@Body() data: AssignCourse): Promise<HttpResponse> {
    return await this.usersService.unAssignCourse(data.userId, data.courseId);
  }
}
