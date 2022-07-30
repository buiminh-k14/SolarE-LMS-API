import { Module } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course, Department } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Course])],
  controllers: [DepartmentController],
  providers: [DepartmentService],
})
export class DepartmentModule {}
