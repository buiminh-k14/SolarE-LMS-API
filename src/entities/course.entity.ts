import { IsString } from 'class-validator';
import { BaseEntity } from './base.entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import User from './user.entity';
import Department from './department.entity';

@Entity()
export default class Course extends BaseEntity {
  @Column()
  @IsString()
  public name: string;

  @Column()
  @IsString()
  public documentURL: string;

  @ManyToMany(() => User, (user) => user.courses)
  @JoinTable({
    name: 'user_course',
    joinColumn: {
      name: 'courseId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @ManyToMany(() => Department, (department) => department.courses)
  @JoinTable({
    name: 'department_course',
    joinColumn: {
      name: 'courseId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'departmentId',
      referencedColumnName: 'id',
    },
  })
  departments: Department[];

  constructor(partial: Partial<Course>) {
    super();
    Object.assign(this, partial);
  }
}
