import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpMessage } from 'src/constans/httpMessage';
import { HttpResponse } from 'src/constans/httpResponse';
import { Course, Department } from 'src/entities';

import { Repository } from 'typeorm';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private repository: Repository<Department>,
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
  ) {}

  async create(newDepartment: Department): Promise<HttpResponse> {
    const department: Department = await this.repository.save(
      new Department(newDepartment),
    );
    return HttpResponse(
      department,
      HttpMessage.CREATED_DEPARTMENT,
      HttpStatus.CREATED,
      HttpMessage.BAD_REQUEST,
      HttpStatus.BAD_REQUEST,
    );
  }

  async findAll(): Promise<HttpResponse> {
    const departments = await this.repository
      .createQueryBuilder()
      .where('department.isActivate = :isActivate', { isActivate: 1 })
      .leftJoinAndSelect('Department.users', 'user')
      .leftJoinAndSelect('Department.courses', 'course')
      .getMany();
    return HttpResponse(
      Object.values(departments)[0] ? departments : undefined,
      HttpMessage.SUCCESS,
      HttpStatus.OK,
      HttpMessage.INVALID_DEPARTMENT,
      HttpStatus.BAD_REQUEST,
    );
  }

  async findOne(id: string, getUser: boolean = true): Promise<HttpResponse> {
    const department = getUser
      ? await this.repository
          .createQueryBuilder()
          .where('department.id = :id', { id: id })
          .andWhere('department.isActivate = :isActivate', { isActivate: 1 })
          .leftJoinAndSelect('Department.users', 'user')
          .leftJoinAndSelect('Department.courses', 'course')
          .getOne()
      : await this.repository
          .createQueryBuilder()
          .where('department.id = :id', { id: id })
          .andWhere('department.isActivate = :isActivate', { isActivate: 1 })
          .leftJoinAndSelect('Department.courses', 'course')
          .getOne();
    return HttpResponse(
      department,
      HttpMessage.SUCCESS,
      HttpStatus.OK,
      HttpMessage.INVALID_DEPARTMENT,
      HttpStatus.BAD_REQUEST,
    );
  }

  async update(id: string, newDepartment: Department): Promise<HttpResponse> {
    const checkDepartment = await this.findOne(id);
    if (checkDepartment.data) {
      if ((await this.repository.update(id, newDepartment)).affected > 0) {
        return (await this.findOne(id)).data;
      }
      return HttpResponse();
    }
    return checkDepartment;
  }

  async remove(id: string): Promise<HttpResponse> {
    const checkDepartment = await this.findOne(id);
    if (checkDepartment.data) {
      if (
        (
          await this.repository.update(
            id,
            new Department({ isActivate: false }),
          )
        ).affected > 0
      ) {
        return HttpResponse('success');
      }
      return HttpResponse();
    }
    return checkDepartment;
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

  async assignCourse(departmentId: string, courseId: string) {
    const checkDepartment = await this.findOne(departmentId, false);
    if (checkDepartment.data) {
      const department: Department = checkDepartment.data;
      const checkCourse = await this.findCourse(courseId);
      if (checkCourse.data) {
        if (department.courses) {
          department.courses.push(checkCourse.data);
          return HttpResponse(
            await this.repository.save(department),
            HttpMessage.ASSIGNED_COURSE_FOR_DEPARTMENT,
            HttpStatus.CREATED,
          );
        }
        department.courses = [checkCourse.data];
        return HttpResponse(
          await this.repository.save(department),
          HttpMessage.ASSIGNED_COURSE_FOR_DEPARTMENT,
          HttpStatus.CREATED,
        );
      }
      return checkCourse;
    }
    return checkDepartment;
  }

  async unAssignCourse(departmentId: string, courseId: string) {
    const checkDepartment = await this.findOne(departmentId, false);
    if (checkDepartment.data) {
      const department: Department = checkDepartment.data;
      if (department.courses) {
        const checkCourse = await this.findCourse(courseId);
        if (checkCourse.data) {
          department.courses = department.courses.filter(
            (item) => item.id !== courseId,
          );
          return HttpResponse(
            await this.repository.save(department),
            HttpMessage.UNASSIGNED_COURSE_FOR_DEPARTMENT,
            HttpStatus.CREATED,
          );
        }
        return checkCourse;
      }
      return HttpResponse(
        null,
        null,
        null,
        HttpMessage.DEPARTMENT_WITHOUT_COURSE,
        HttpStatus.BAD_REQUEST,
      );
    }
    return checkDepartment;
  }
}
