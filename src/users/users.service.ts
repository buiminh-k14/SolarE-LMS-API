import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpMessage } from 'src/constans/httpMessage';
import { HttpResponse } from 'src/constans/httpResponse';
import { Course, Department, User } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}
  async create(newUser: User): Promise<HttpResponse> {
    try {
      return HttpResponse(
        await this.repository.save(new User(newUser)),
        HttpMessage.CREATED_USER,
        HttpStatus.CREATED,
      );
    } catch {
      return HttpResponse(
        null,
        null,
        null,
        HttpMessage.BAD_REQUEST,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<HttpResponse> {
    const users = await this.repository
      .createQueryBuilder()
      .where('user.isActivate = :isActivate', { isActivate: 1 })
      .leftJoinAndSelect('User.department', 'department')
      .getMany();
    return HttpResponse(
      Object.values(users)[0] ? users : undefined,
      HttpMessage.SUCCESS,
      HttpStatus.OK,
      HttpMessage.INVALID_USER,
      HttpStatus.BAD_REQUEST,
    );
  }

  async findOne(
    id: string,
    getDepartment: Boolean = true,
  ): Promise<HttpResponse> {
    const user = getDepartment
      ? await this.repository
          .createQueryBuilder()
          .where('user.id = :id', { id: id })
          .andWhere('user.isActivate = :isActivate', { isActivate: 1 })
          .leftJoinAndSelect('User.department', 'department')
          .leftJoinAndSelect('User.courses', 'course')
          .getOne()
      : await this.repository
          .createQueryBuilder()
          .where('user.id = :id', { id: id })
          .andWhere('user.isActivate = :isActivate', { isActivate: 1 })
          .leftJoinAndSelect('User.courses', 'course')
          .getOne();
    return HttpResponse(
      user,
      HttpMessage.SUCCESS,
      HttpStatus.OK,
      HttpMessage.INVALID_USER,
      HttpStatus.BAD_REQUEST,
    );
  }

  async update(id: string, newUser: User): Promise<HttpResponse> {
    const checkUser = await this.findOne(id);
    if (checkUser.data) {
      if ((await this.repository.update(id, newUser)).affected > 0) {
        return (await this.findOne(id)).data;
      }
      return HttpResponse();
    }
    return checkUser;
  }

  async remove(id: string): Promise<HttpResponse> {
    const checkUser = await this.findOne(id);
    if (checkUser.data) {
      if (
        (await this.repository.update(id, new User({ isActivate: false })))
          .affected > 0
      ) {
        return HttpResponse('success');
      }
      return HttpResponse();
    }
    return checkUser;
  }

  // course
  async findCourse(id: string): Promise<HttpResponse> {
    const course = await this.courseRepository
      .createQueryBuilder()
      .where('course.id = :id', { id: id })
      .andWhere('course.isActivate = :isActivate', { isActivate: 1 })
      .getOne();
    return HttpResponse(
      course,
      HttpMessage.SUCCESS,
      HttpStatus.OK,
      HttpMessage.INVALID_COURSE,
      HttpStatus.BAD_REQUEST,
    );
  }

  async assignCourse(userId: string, courseId: string) {
    const checkUser = await this.findOne(userId, false);
    if (checkUser.data) {
      const user: User = checkUser.data;
      const checkCourse = await this.findCourse(courseId);
      if (checkCourse.data) {
        if (user.courses) {
          user.courses.push(checkCourse.data);
          return HttpResponse(
            await this.repository.save(user),
            HttpMessage.ASSIGNED_COURSE_FOR_USER,
            HttpStatus.CREATED,
          );
        }
        user.courses = [checkCourse.data];
        return HttpResponse(
          await this.repository.save(user),
          HttpMessage.ASSIGNED_COURSE_FOR_USER,
          HttpStatus.CREATED,
        );
      }
      return checkCourse;
    }
    return checkUser;
  }

  async unAssignCourse(userId: string, courseId: string) {
    const checkUser = await this.findOne(userId, false);
    if (checkUser.data) {
      const user: User = checkUser.data;
      if (user.courses) {
        const checkCourse = await this.findCourse(courseId);
        if (checkCourse.data) {
          user.courses = user.courses.filter((item) => item.id !== courseId);
          return HttpResponse(
            await this.repository.save(user),
            HttpMessage.UNASSIGNED_COURSE_FOR_USER,
            HttpStatus.CREATED,
          );
        }
        return checkCourse;
      }
      return HttpResponse(
        null,
        null,
        null,
        HttpMessage.USER_WITHOUT_COURSE,
        HttpStatus.BAD_REQUEST,
      );
    }
    return checkUser;
  }
}
