import { Exclude, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @IsString()
  public id: string;

  @Column()
  @Type(() => Date)
  @IsDate()
  public createDate: Date;

  @Column()
  @Type(() => Date)
  @IsDate()
  public modifyDate: Date;

  @Column({ default: true })
  @Exclude()
  @IsBoolean()
  public isActivate: boolean;

  @BeforeInsert()
  protected generatedDateBeforeInsert(): void {
    this.createDate = new Date();
    this.modifyDate = this.createDate;
  }

  @BeforeUpdate()
  protected generatedDateBeforeUpdate(): void {
    this.modifyDate = new Date();
  }
}
