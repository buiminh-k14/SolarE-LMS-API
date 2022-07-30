import { IsString } from 'class-validator';
import { BaseEntity } from './base.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import Department from './department.entity';
import Course from './course.entity';

@Entity()
export default class User extends BaseEntity {
  @Column()
  @IsString()
  public fistName: string;

  @Column()
  @IsString()
  public lastName: string;

  @Column({ default: false })
  @IsString()
  public isAdmin: boolean;

  @ManyToOne(() => Department, (department) => department.users, {
    nullable: false,
  })
  department: Department;

  @ManyToMany(() => Course, (course) => course.users)
  courses: Course[];

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }
}
