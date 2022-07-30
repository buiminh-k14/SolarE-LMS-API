import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course, User } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
