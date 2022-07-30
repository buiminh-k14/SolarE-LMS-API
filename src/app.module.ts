import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartmentModule } from './department/department.module';
import { Course, Department, User } from './entities';
import { UsersModule } from './users/users.module';
import { CourseModule } from './course/course.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '1234',
      database: 'solare_lms',
      entities: [User, Department, Course],
      synchronize: true,
      logging: ['query'],
    }),
    UsersModule,
    DepartmentModule,
    CourseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
