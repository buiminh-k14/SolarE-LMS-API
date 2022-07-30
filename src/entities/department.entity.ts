import { IsString } from 'class-validator';
import { BaseEntity } from './base.entity';
import { Column, Entity, ManyToMany, OneToMany } from 'typeorm';
import User from './user.entity';
import Course from './course.entity';

@Entity()
export default class Department extends BaseEntity {
  @Column()
  @IsString()
  public name: string;

  @OneToMany(() => User, (user) => user.department, {
    nullable: false,
  })
  users: User[];

  @ManyToMany(() => Course, (course) => course.departments, {
    cascade: true,
  })
  courses: Course[];

  constructor(partial: Partial<Department>) {
    super();
    Object.assign(this, partial);
  }
}
