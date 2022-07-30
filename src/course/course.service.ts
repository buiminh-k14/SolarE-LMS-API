import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpMessage } from 'src/constans/httpMessage';
import { HttpResponse } from 'src/constans/httpResponse';
import { Course } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course)
    private repository: Repository<Course>,
  ) {}

  async create(newCourse: Course): Promise<HttpResponse> {
    const course: Course = await this.repository.save(new Course(newCourse));
    return HttpResponse(
      course,
      HttpMessage.CREATED_COURSE,
      HttpStatus.CREATED,
      HttpMessage.BAD_REQUEST,
      HttpStatus.BAD_REQUEST,
    );
  }

  async findAll(): Promise<HttpResponse> {
    const courses = await this.repository
      .createQueryBuilder()
      .where('course.isActivate = :isActivate', { isActivate: 1 })
      .getMany();
    return HttpResponse(
      Object.values(courses)[0] ? courses : undefined,
      HttpMessage.SUCCESS,
      HttpStatus.OK,
      HttpMessage.INVALID_COURSE,
      HttpStatus.BAD_REQUEST,
    );
  }

  async findOne(id: string): Promise<HttpResponse> {
    const course = await this.repository
      .createQueryBuilder()
      .where('course.id = :id', { id: id })
      .andWhere('course.isActivate = :isActivate', { isActivate: 1 })
      .getOne();
    return HttpResponse(
      course,
      HttpMessage.SUCCESS,
      HttpStatus.OK,
      HttpMessage.INVALID_DEPARTMENT,
      HttpStatus.BAD_REQUEST,
    );
  }

  async update(id: string, newCourse: Course): Promise<HttpResponse> {
    const checkCourse = await this.findOne(id);
    if (checkCourse.data) {
      if ((await this.repository.update(id, newCourse)).affected > 0) {
        return (await this.findOne(id)).data;
      }
      return HttpResponse();
    }
    return checkCourse;
  }

  async remove(id: string): Promise<HttpResponse> {
    const checkCourse = await this.findOne(id);
    if (checkCourse.data) {
      if (
        (await this.repository.update(id, new Course({ isActivate: false })))
          .affected > 0
      ) {
        return HttpResponse('success');
      }
      return HttpResponse();
    }
    return checkCourse;
  }
}
